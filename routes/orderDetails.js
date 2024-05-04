const express = require('express');
const { validateOrderDetail, OrderDetail } = require('../models/oderDetail');
const { validateClaimDetail } = require('../models/claim');
var NumberInt = require('mongodb').Int32;

const auth = require('../middleware/auth');
const sendEmail = require('../utils/email/sendEmail');
const { COUNTRY_PREFIXES, INVOICE_STATUS } = require('../constants');


// const COUNTRY_PREFIXES = [
//     { country: 'Estonia', value: 'ES' },
//     { country: 'Finland', value: 'FL' },
//     { country: 'Denmark', value: 'DK' },
//     { country: 'Czech Republic', value: 'CZ' },
//     { country: 'Luxemburg', value: 'LU' },
//     { country: 'Austria', value: 'AU' },
//     { country: 'Lithuania', value: 'LT' },
//     { country: 'Latvia', value: 'LV' },
//     { country: 'Germany', value: 'DE' },
//     { country: 'United Kingdom', value: 'GB' },
//     { country: 'Belgium', value: 'BL' },
//     { country: 'Holland', value: 'NL' },
//     { country: 'Poland', value: 'PL' },
//     { country: 'France', value: 'FR' },
// ];
// const INVOICE_STATUS = [
//     { label: 'Un paid', value: 'Unpaid', color: '' },
//     { label: 'Paid', value: 'Paid', color: '' },
//     { label: 'Over due', value: 'Overdue', color: '' },
// ];
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { error } = validateOrderDetail(req.body)
    if (error) return res.status(400).send(error.details && error.details[0] && error.details[0])

    let user = req.user
    let prefix = ""
    for (var i = 0; i < COUNTRY_PREFIXES.length; i++) {
        if (COUNTRY_PREFIXES[i].country.toLocaleLowerCase() === req.body.fromCountry.label.toLocaleLowerCase()) {
            prefix = COUNTRY_PREFIXES[i].value + '0'
        }
    }

    const length = await OrderDetail.find({})
    const orderId = prefix + Number(length.length + 1)
    let order = new OrderDetail({ ...req.body, customerId: user._id, orderId })
    await order.save()
    res.status(200).send({ message: "Booking successful", orderId })

    sendEmail(
        user.email,
        "Order Confirmation",
        {
            name: user.firstname,
            orderId: order.orderId,
            fromCountry: order.fromCountry.label,
            toCountry: order.toCountry.label
        },
        "./template/newOrderConfirmation.handlebars"
    );
})

router.get('/me', auth, async (req, res) => {
    let user = req.user
    let orders = await OrderDetail.find({ customerId: user.id },{secretComment: 0, extraCost: 0}).sort({ $natural: -1 })
    res.send(orders)
})

router.get('/', auth, async (req, res) => {
    let user = req.user
    console.log(req.query);
    const page = req.query.page
    const limit = 100
    const skip = (page - 1) * limit

    const inputValue = req.query.inputValue;
    const dropdownValue = req.query.dropdownValue;
    const invoiceStatus = req.query.invoiceStatus;
    const orderStatus = req.query.orderStatus;
    // {'$match'     : {$or: [{'invoiceStatus.label': {$in: ["Paid"]}}, {'status.label': {$in: ["Order Placed"]}}, {"orderId": { "$regex": 'LI01', "$options": "i" }}]
    //     }}
    if (!user.isAdmin) return res.status(401).send()
    let orders = await OrderDetail.aggregate([
        { '$match': {} },
        // { '$addFields': { result: { '$regex': { input: "$orderId", regex: /Es/ } } } },
        { '$sort': { 'createdAt': -1 } },
        {
            '$facet': {
                metadata: [{ $count: "total" }, { $addFields: { page: NumberInt(page) } }],
                data: [{ $skip: skip }, { $limit: limit }] // add projection here wish you re-shape the docs
            }
        }
    ])
    res.send(orders)
})

router.put('/:id', auth, async (req, res) => {

    let user = req.user
    if (user) {
        try {
            const { error } = validateOrderDetail(req.body)
            if (error) return res.status(400).send(error.details && error.details[0] && error.details[0])
            const order = await OrderDetail.findByIdAndUpdate(req.params.id,
                { ...req.body, customerId: decoded.id }, { new: true, runValidators: true })
            if (!order) {
                return res.status(404).send({ message: 'Something went wrong.' })
            }
            res.status(200).send(order)
        } catch (error) {
            res.status(400).send(error)
        }
    }

})

router.get('/claims/me', auth, async (req, res) => {
    let user = req.user
    let orders = await OrderDetail.find({ customerId: user._id, insuranceRequired: 'Yes' }).sort({ $natural: -1 })
    res.send(orders)
})

router.get('/claims', auth, async (req, res) => {
    let user = req.user
    if (!user.isAdmin) return res.status(401).send()
    let orders = await OrderDetail.find({ insuranceRequired: 'Yes' }).sort({ $natural: -1 })
    res.send(orders)
})


router.put('/claim/:orderId', auth, async (req, res) => {
    const { error } = validateClaimDetail(req.body)
    if (error) return res.status(400).send(error.details && error.details[0] && error.details[0])

    try {
        const order = await OrderDetail.findOneAndUpdate({ orderId: req.params.orderId },
            { ...req.body, customerId: decoded.id }, { new: true, runValidators: true })
        if (!order) {
            return res.status(404).send({ message: 'Something went wrong.' })
        }
        res.status(200).send(order)

        sendEmail(
            order.email,
            "Insurance Claim Confirmation",
            {
                orderId: order.orderId
            },
            "./template/insuranceClaimConfirmation.handlebars"
        );
    } catch (error) {
        res.status(400).send(error)
    }


})

router.put('/orderStatus/:orderId', auth, async (req, res) => {
    let user = req.user
    if (!user.isAdmin) return res.status(401).send()

    try {
        const order = await OrderDetail.findOneAndUpdate({ orderId: req.params.orderId },
            { status: req.body.status }, { new: true, runValidators: true })
        if (!order) {
            return res.status(404).send({ message: 'Something went wrong.' })
        }
        res.status(200).send(order)
    } catch (error) {
        res.status(400).send(error)
    }

})

router.put('/invoiceStatus/:orderId', auth, async (req, res) => {
    let user = req.user
    if (!user.isAdmin) return res.status(401).send()

    try {
        const order = await OrderDetail.findOneAndUpdate({ orderId: req.params.orderId },
            { invoiceStatus: req.body.invoiceStatus, partlyAmount: req.body.partlyAmount }, { new: true, runValidators: true })
        if (!order) {
            return res.status(404).send({ message: 'Something went wrong.' })
        }
        res.status(200).send(order)
    } catch (error) {
        res.status(400).send(error)
    }

})

//generate invoice
router.put('/invoiceGenerate/:orderId', auth, async (req, res) => {
    let user = req.user
    if (!user.isAdmin) return res.status(401).send()

    try {
        const order = await OrderDetail.findOneAndUpdate({ orderId: req.params.orderId },
            { isInvoiceGenerated: req.body.isInvoiceGenerated, invoiceDate: req.body.invoiceDate, dueDate: req.body.dueDate }, { new: true, runValidators: true })
        if (!order) {
            return res.status(404).send({ message: 'Something went wrong.' })
        }
        res.status(200).send(order)
    } catch (error) {
        res.status(400).send(error)
    }

})

//insurance claim status
router.put('/claimStatus/:orderId', auth, async (req, res) => {
    let user = req.user
    if (!user.isAdmin) return res.status(401).send()

    try {
        const order = await OrderDetail.findOneAndUpdate({ orderId: req.params.orderId },
            { claimStatus: req.body.claimStatus }, { new: true, runValidators: true })
        if (!order) {
            return res.status(404).send({ message: 'Something went wrong.' })
        }
        res.status(200).send(order)
    } catch (error) {
        res.status(400).send(error)
    }

})

router.put('/dueDate/invoiceStatus', auth, async (req, res) => {
    const query = req.user.idAdmin ? { orderId: { '$in': req.body.orderIds } } : { orderId: { '$in': req.body.orderIds }, customerId: req.user._id }
    try {
        const order = await OrderDetail.updateMany(query, { '$set': { invoiceStatus: INVOICE_STATUS[2] } })
        if (!order) {
            return res.status(404).send({ message: 'Something went wrong...' })
        }
        res.status(200).send(order)
    } catch (error) {
        res.status(400).send(error)
    }

})

router.put('/secretComment/:orderId', auth, async (req, res) => {
    let user = req.user
    if (!user.isAdmin) return res.status(401).send()

    try {
        const order = await OrderDetail.findOneAndUpdate({ orderId: req.params.orderId },
            { secretComment: req.body.secretComment }, { new: true, runValidators: true })
        if (!order) {
            return res.status(404).send({ message: 'Something went wrong.' })
        }
        res.status(200).send(order)
    } catch (error) {
        res.status(400).send(error)
    }

})


module.exports = router