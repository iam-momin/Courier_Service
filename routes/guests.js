const _ = require('lodash')
const Joi = require('joi');

const express = require('express');
// const { validateGuest, Guest } = require('../models/guest');
const { User } = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateGuest(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.emai })
    if (user) {
        const token = user.generateAuthToken();
        res.send(token);
        return
    }
    user = new User(_.pick(req.body, ['email', 'isAdmin', 'isGuest']))
    await user.save()
    const token = user.generateAuthToken();
    res.send(token);
})

function validateGuest(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        isAdmin: Joi.boolean()
    });

    return schema.validate(user)
}

module.exports = router