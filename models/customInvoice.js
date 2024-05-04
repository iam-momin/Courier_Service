const Joi = require('joi');
const mongoose = require('mongoose');

const customInvoiceFormSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId
    },
    orderId: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    senderName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15,
    },
    receiverName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15,
    },
    senderAddress: {
        type: String,
    },
    receiverAddress: {
        type: String,
    },
    content: {
        type: Object,
    },
    numberOfParcels: {
        type: Number,
    },
    originOfGoods: {
        type: Object,
        // required: true,
    },
    insuredFor: {
        type: Number,
        required: true
    },
    contents: {
        type: Array,
    },
    signatureDataArray: {
        type: String,
    },
    totalValueOfGoods: {
        type: Number,
        required: true
    },
    totalWeight: {
        type: Number,
    },
    currency: {
        type: Object,
        required: true,
    },
    status: {
        type: Object,
        required: true,
    },
    editDisabled: {
        type: Boolean,
        default: false
    },
    isAppliedForRelief: {
        type: Boolean | String,
        default: ''
    },
    importDeclaration: {
        type: Object,
        default: {}
    }
}, { timestamps: true })

const CustomInvoice = mongoose.model('CustomInvoice', customInvoiceFormSchema)

function validateCustomInvoiceDetail(customInvoice) {
    const schema = Joi.object({
        // customerId: Joi.string().required(),
        orderId: Joi.string().required(),
        email: Joi.string(),
        senderName: Joi.string().min(3).required(),
        receiverName: Joi.string().min(3).required(),
        senderAddress: Joi.string().required().allow(''),
        receiverAddress: Joi.string().required().allow(''),
        content: Joi.object(),
        numberOfParcels: Joi.number(),
        originOfGoods: Joi.object().required(),
        insuredFor: Joi.number(),
        contents: Joi.array(),
        signatureDataArray: Joi.string(),
        totalValueOfGoods: Joi.number().required(),
        totalWeight: Joi.number().allow(''),
        currency: Joi.object().required(),
        status: Joi.object().required(),
        editDisabled: Joi.boolean(),
        isAppliedForRelief: Joi.boolean().allow(''),
        importDeclaration: Joi.object(),
    })
    return schema.validate(customInvoice)
}

exports.CustomInvoice = CustomInvoice
exports.validateCustomInvoiceDetail = validateCustomInvoiceDetail