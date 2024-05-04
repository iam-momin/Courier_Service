const express = require('express');
const { validateCustomInvoiceDetail, CustomInvoice } = require('../models/customInvoice');
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/email/sendEmail');

const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validateCustomInvoiceDetail(req.body)
    if (error) return res.status(400).send(error.details && error.details[0] && error.details[0])

    let user = req.user
    let count = await CustomInvoice.countDocuments({ orderId: req.body.orderId })
    if (count > 0) return res.status(400).send('already exist!')
    if (user) {
        let customInvoice = new CustomInvoice({ ...req.body, customerId: user.id })
        await customInvoice.save()
        res.status(200).send({ message: "Custom Form submitted successfully" })

        sendEmail(
            user.email,
            "Commercial Invoice Confirmation",
            {
                orderId: req.body.orderId
            },
            "./template/commercialInvoiceConfirmation.handlebars"
        );
    } else {
        return res.status(401).send('unauthorized');
    }

})

router.get('/me', auth, async (req, res) => {
    let user = req.user
    let customInvoice = await CustomInvoice.find({ customerId: user._id }).sort({$natural:-1})
    res.send(customInvoice)

})
router.get('/', auth, async (req, res) => {
    let user = req.user
    if (!user.isAdmin) return res.status(401).send()
    let customInvoice = await CustomInvoice.find({}).sort({$natural:-1})
    res.send(customInvoice)

})

router.delete('/:orderId', async (req, res) => {
    let customInvoice = await CustomInvoice.findOneAndDelete({ orderId: req.params.orderId })
    res.send(customInvoice)

})

router.put('/:orderId', auth, async (req, res) => {
    const { error } = validateCustomInvoiceDetail(req.body)
    if (error) return res.status(400).send(error.details && error.details[0] && error.details[0])

    try {
        const customInvoice = await CustomInvoice.findOneAndUpdate({ orderId: req.params.orderId },
            { ...req.body, customerId: decoded.id }, { new: true, runValidators: true })
        if (!customInvoice) {
            return res.status(404).send({ message: 'Something went wrong.' })
        }
        res.status(200).send(customInvoice)


        sendEmail(
            req.body.email,
            "Commercial Invoice Completed",
            {
                orderId: req.body.orderId,
            },
            "./template/commercialInvoiceCompleted.handlebars"
        );

    } catch (error) {
        res.status(400).send(error)
    }

})

router.put('/disableEdit/:orderId', auth, async (req, res) => {
    if (!req.user.isAdmin) return res.status(401).send()

    try {
        const customInvoice = await CustomInvoice.findOneAndUpdate({ orderId: req.params.orderId },
            { editDisabled: req.body.editDisabled }, { new: true, runValidators: true })
        if (!customInvoice) {
            return res.status(404).send({ message: 'Something went wrong.' })
        }
        res.status(200).send(customInvoice)
    } catch (error) {
        res.status(400).send(error)
    }

})
router.put('/formStatus/:orderId', auth, async (req, res) => {
    let user = req.user
    if (!user.isAdmin) return res.status(401).send()
    console.log('form...', req.params);
    try {
        const customInvoice = await CustomInvoice.findOneAndUpdate({ orderId: req.params.orderId },
            { status: req.body.status }, { new: true, runValidators: true })
        if (!customInvoice) {
            return res.status(404).send({ message: 'Something went wrong.' })
        }
        res.status(200).send(customInvoice)
    } catch (error) {
        res.status(400).send(error)
    }

})


module.exports = router
