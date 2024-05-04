
const express = require('express');
const sendEmail = require('../utils/email/sendEmail');

const router = express.Router();


router.get('/paymentReminder/email=:email&amount=:amount&name=:name&orderId=:orderId', async (req, res) => {
    const { email, amount, name, orderId } = req.params
    try {
        const sendEmailRes = await sendEmail(email, "Payment Due Reminder", { name, amount, orderId }, "./template/invoiceReminder.handlebars");
        if (sendEmailRes && sendEmailRes.accepted.length > 0) {
            res.status(200).send('Email sent successfully')
        }
    } catch (err) {
        res.send(err)
    }

})

router.get('/ciReminder/email=:email&orderId=:orderId', async (req, res) => {
    const { email, amount, name, orderId } = req.params
    try {
        const sendEmailRes = await sendEmail(email, "Commercial Invoice Pending", { name, orderId }, "./template/commercialInvoiceReminder.handlebars");
        if (sendEmailRes && sendEmailRes.accepted.length > 0) {
            res.status(200).send('Email sent successfully')
        }
    } catch (err) {
        res.send(err)
    }

})


module.exports = router