const Joi = require('joi');
const mongoose = require('mongoose');

const cmr = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId
    },
    orderId: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    senderAddress: {
        type: String,
        required: true
    },
    senderCountry: {
        type: Object,
        required: true
    },
    receiverName: {
        type: String,
        required: true
    },
    receiverAddress: {
        type: String,
        required: true
    },
    receiverCountry: {
        type: Object,
        required: true
    },
    marksAndNos: {
        type: String,
        default: ''
        // required: true
    },
    numberOfParcel: {
        type: Number,
        required: true
    },
    methodOfPacking: {
        type: String,
        default: ''
        // required: true,
    },
    natureOfGoods: {
        type: String,
        // required: true
    },
    statisticalNr: {
        type: String,
        default: ''
        // required: true
    },
    grossWeight: {
        type: Number,
        required: true
    },
    volume: {
        type: Number,
        required: true
    },
    senderInstructions: {
        type: String,
        default: ''
        // required: true
    },
    cashOnDelivery: {
        type: Boolean,
        default: false
        // required: true
    },
    instructionPaymentCarriage: {
        type: String,
        default: ''
        // required: true
    },

}, { timestamps: true })



const Cmr = mongoose.model('Cmr', cmr)

function validateCmr(order) {
    const schema = Joi.object({
        orderId: Joi.string().required(),
        senderName: Joi.string().required(),
        senderAddress: Joi.string().required(),
        senderCountry: Joi.object().required(),
        receiverName: Joi.string().required(),
        receiverAddress: Joi.string().required(),
        receiverCountry: Joi.object().required(),
        marksAndNos: Joi.string().allow(''),
        numberOfParcel: Joi.number().required(),
        methodOfPacking: Joi.string().allow(''),
        natureOfGoods: Joi.string().allow(''),
        statisticalNr: Joi.string().allow(''),
        grossWeight: Joi.number(),
        volume: Joi.number(),
        senderInstructions: Joi.string().allow(''),
        cashOnDelivery: Joi.boolean(),
        instructionPaymentCarriage: Joi.string().allow(''),
    })
    return schema.validate(order)
}

exports.Cmr = Cmr
exports.validateCmr = validateCmr