const express = require('express');
const { validateCmr, Cmr } = require('../models/cmr');
const auth = require('../middleware/auth');
const { OrderDetail } = require('../models/oderDetail');

const router = express.Router();
router.post('/', auth, async (req, res) => {
    const payload = req.body;
    const orderId = req.body.orderId;

    const { error } = validateCmr(payload)
    if (error) return res.status(400).send(error.details && error.details[0] && error.details[0])
    const order = await OrderDetail.findOne({orderId: orderId})
    if(!order) return res.status(400).send('Bad Request')
    const oldCmr = await Cmr.findOne({orderId: orderId})
    if(oldCmr) return res.status(409).send(`Data already exist for ${orderId}`)
    
    let cmr = new Cmr({...payload, customerId: req.user._id})
    await cmr.save()
    res.status(200).send()
})

router.get('/', auth, async (req, res) => {
    let user = req.user
    if (!user.isAdmin) return res.status(401).send()
    let cmr = await Cmr.find().sort({$natural:-1})
    res.send(cmr)
})

router.put('/:id', auth, async (req, res)=>{
    let user = req.user
    if (!user.isAdmin) return res.status(401).send()
    try {
        const { error } = validateCmr(req.body)
        if (error) return res.status(400).send(error.details && error.details[0] && error.details[0])
        const cmr = await Cmr.findByIdAndUpdate(req.params.id,
            { ...req.body, customerId: decoded.id }, { new: true, runValidators: true })
        if (!cmr) {
            return res.status(404).send({ message: 'Something went wrong.' })
        }
        res.status(200).send(cmr)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router