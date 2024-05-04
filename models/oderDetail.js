const Joi = require('joi');
const mongoose = require('mongoose');
const date14 = new Date(Date.now() + 12096e5)
const dueDateString = `${date14.getDate()}/${(date14.getMonth() + 1).toString().length == 1 ? '0' + (date14.getMonth() + 1) : (date14.getMonth() + 1)}/${date14.getFullYear()}`
const orderDetailSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId
    },
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 15,
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    collectionAddress1: {
        type: String,
        minlength: 1,
        maxlength: 30,
        default: "-"
    },
    collectionAddress2: {
        type: String,
        default: "-"
    },
    collectionCity: {
        type: String,
        minlength: 1,
        maxlength: 15,
        default: "-"
    },
    collectionZipCode: {
        type: String,
        default: "-"
    },
    deliveryAddress1: {
        type: String,
        maxlength: 30,
        default: "-"
    },
    deliveryAddress2: {
        type: String,
        default: "-"
    },
    deliveryCity: {
        type: String,
        minlength: 1,
        maxlength: 15,
        default: "-"
    },
    deliveryZipCode: {
        type: String,
        default: "-"
    },
    receiverPhone: {
        type: Array,
        required: true,
    },
    receiverName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 15,
    },
    numberOfParcel: {
        type: Number,
    },
    parcelDetailsList: {
        type: Array,
        required: true,
    },
    allParcelDetailsSum: {
        type: Object,
        required: true,
    },
    fromCountry: {
        type: Object,
        required: true,
    },
    toCountry: {
        type: Object,
        required: true,
    },
    invoiceCurrency: {
        type: Object,
        required: true,
    },
    preferredDate: {
        type: Date,
    },
    status: {
        type: Object,
        // default: { label: 'Order Placed', id: 1 }
    },
    insuranceRequired: {
        type: String,
        required: true
    },
    additionalServices: {
        type: Array,
        required: true
    },
    companyDetails: {
        type: String,
        maxlength: 255,
    },
    insuranceDetails: {
        type: Array,
    },
    // signatureDataArray: {
    //     type: Array,
    // },
    parcelImages: {
        type: Array,
    },
    expectedCost: {
        type: Number,
        required: true
    },
    fromParcelPoint: {
        type: Object,
    },
    toParcelPoint: {
        type: Object,
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    senderName: {
        type: String,
        required: true
    },
    senderPhone: {
        type: Array,
        required: true
    },
    insurancePremium: {
        type: Number,
    },
    insuranceTotalValue: {
        type: Number
    },
    invoiceStatus: {
        type: Object,
        required: true,
    },
    claimStatus: {
        type: Object,
        required: true
    },
    claimDetails: {
        type: Object,
    },
    fromParcelPointRadio: {
        type: Number,
    },
    toParcelPointRadio: {
        type: Number,
    },
    isInvoiceGenerated: {
        type: Boolean
    },
    dueDate: {
        type: String,
        default: "-"
    },
    invoiceDate: {
        type: String,
    },
    parcelPdf: {
        type: Object
    },
    extraCost: {
        type: Object
    },
    partlyAmount: {
        type: Number,
        default: 0
    },
    totalInvoiceAmount: {
        type: Number,
    },
    collectionInstructions: {
        type: String
    },
    deliveryInstructions: {
        type: String
    },
    otherInformations: {
        type: String
    },
    cashPaymentOn: {
        type: Object
    },
    instructionsForCashHandling: {
        type: String
    },
    photoOnDelivery: {
        type: Array,
    },
    signatureOnDelivery: {
        type: String,
    },
    secretComment:{
        type: String,
        default: ''
    },
    unexpectedCost:{
        type: Object,
        default: {message: '', cost: 0}
    }

}, { timestamps: true })

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema)

function validateOrderDetail(order) {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        firstName: Joi.string().min(3).max(15).required(),
        lastName: Joi.string().min(1).max(15).required(),
        email: Joi.string().min(3).max(50).required(),
        collectionAddress1: Joi.string().min(1).max(20),
        collectionAddress2: Joi.string().allow(''),
        collectionCity: Joi.string().min(1).max(20),
        collectionZipCode: Joi.string().allow(''),
        deliveryAddress1: Joi.string().min(1).max(20),
        deliveryAddress2: Joi.string().allow(''),
        deliveryCity: Joi.string().min(1).max(15),
        deliveryZipCode: Joi.string().allow(''),
        receiverPhone: Joi.array().required(),
        receiverName: Joi.string().min(1).max(15).required(),
        numberOfParcel: Joi.number(),
        parcelDetailsList: Joi.array().required(),
        allParcelDetailsSum: Joi.object().required(),
        fromCountry: Joi.object().required(),
        toCountry: Joi.object().required(),
        invoiceCurrency: Joi.object().required(),
        preferredDate: Joi.date().allow(''),
        insuranceRequired: Joi.string().required(),
        additionalServices: Joi.array().required(),
        companyDetails: Joi.string().allow('').max(255),
        insuranceDetails: Joi.array(),
        // signatureDataArray: Joi.array(),
        parcelImages: Joi.array(),
        expectedCost: Joi.number().required(),
        fromParcelPoint: Joi.object(),
        toParcelPoint: Joi.object(),
        senderName: Joi.string().required(),
        senderPhone: Joi.array().required(),
        insurancePremium: Joi.number(),
        insuranceTotalValue: Joi.number(),
        invoiceStatus: Joi.object().required(),
        claimStatus: Joi.object().required(),
        claimDetails: Joi.object(),
        fromParcelPointRadio: Joi.number(),
        toParcelPointRadio: Joi.number(),
        status: Joi.object(),
        isInvoiceGenerated: Joi.boolean(),
        dueDate: Joi.string(),
        parcelPdf: Joi.object(),
        extraCost: Joi.object(),
        partlyAmount: Joi.number(),
        totalInvoiceAmount: Joi.number(),
        collectionInstructions: Joi.string().allow(''),
        deliveryInstructions: Joi.string().allow(''),
        otherInformations: Joi.string().allow(''),
        cashPaymentOn: Joi.object().allow(null),
        instructionsForCashHandling: Joi.string().allow(''),
        photoOnDelivery: Joi.array(),
        signatureOnDelivery: Joi.string().allow(''),
        secretComment: Joi.string().allow(''),
        unexpectedCost: Joi.object()
    })
    return schema.validate(order)
}

exports.OrderDetail = OrderDetail
exports.validateOrderDetail = validateOrderDetail