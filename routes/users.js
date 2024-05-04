const _ = require('lodash')
const bcrypt = require('bcrypt')
const config = require('config');
const jwt = require('jsonwebtoken')

const express = require('express');
const { validateUser, User } = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.emai })
    if (user) return res.status(400).send('User Already exist.')
    user = new User(_.pick(req.body, ['email', 'password', 'isAdmin']))

    user.password = await user.getPasswordHash()
    await user.save()
    const token = user.generateAuthToken();
    res.send({token, isAdmin: user.isAdmin});
})

router.get('/email=:email', async (req, res) => {
    let user = await User.findOne({ email: req.params.email })
    if (!user) return res.status(202).send({ message: "user does not exist" })
    res.send({ email: req.params.email })
})

router.get('/', auth, async (req, res) => {
    res.send(req.user)

})

router.get('/allUsers', auth, async (req, res) => {
    let user = req.user
    if (user && user.isAdmin) {
        //const users = await User.find({ _id: { $ne: decoded._id }, name: { $ne: undefined } }, { password: 0 })
        const users = await User.find({}).sort({$natural:-1})
        return res.send(users)
    } else {
        return res.status(401)
    }

})

router.put('/', async (req, res) => {
    const { error } = validateUser(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(202).send({ message: "user does not exist" })

    user.password = req.body.password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    user.save()
    res.send(user.generateAuthToken())
})

router.put('/profile', async (req, res) => {
    const { error } = validateUser({ ...req.body, password: '123455', isAdmin: false })
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOneAndUpdate({ email: req.body.email }, req.body)

    if (!user) return res.status(202).send({ message: "user does not exist" })

    res.send({ message: 'User profile updated successfully!' })
})

router.put('/changePassword', auth, async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) return res.status(400).send('message')
    let user = req.user;

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(newPassword, salt)

    user.password = password;
    const updatedUser = await user.save();
    res.send({ message: "Password updated successfully!" })

})

router.put('/admin/:userId', auth, async (req, res) => {
    let user = req.user
    if (!user) return res.status(404)
    if (!user.isAdmin) return res.status(400)
    const newAdmin = await User.findByIdAndUpdate(req.params.userId, { isAdmin: req.body && req.body.isAdmin }, {new: true})
    // const newAdmin = await User.findOneAndUpdate({_id: ObjectId(req.params.userId)}, {isAdmin: req.body && req.body.isAdmin})

    res.send(newAdmin)
})

router.put('/userInfo/:userId', auth, async (req, res) => {
    let user = req.body
    if (!req.user) return res.status(401)
    if (!req.user.isAdmin) return res.status(401)
    const oldUserWithEmail = await User.findOne({email: user.email})
    if(oldUserWithEmail && oldUserWithEmail._id != req.params.userId) return res.status(409).send('Duplicate email is not allowed!')

    const newUser = await User.findByIdAndUpdate(req.params.userId, user, {new: true})
    if(!newUser) return res.status(404).send('User not found!')
    res.send(newUser)
})

module.exports = router