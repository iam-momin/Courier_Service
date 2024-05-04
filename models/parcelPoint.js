const Joi = require('joi');
const mongoose = require('mongoose');

const parcelPointSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true
    },
    parcelPoint: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    }
})

const ParcelPoint = mongoose.model('ParcelPoint', parcelPointSchema)

function validateParcelPoint(parcelPoint) {
    const schema = Joi.object({
        country: Joi.string().required(),
        parcelPoint: Joi.string().required(),
        cost: Joi.number().required(),
        currency: Joi.string().required(),
        symbol: Joi.string().required()

    })
    return schema.validate(parcelPoint)
}

exports.ParcelPoint = ParcelPoint;
exports.validateParcelPoint = validateParcelPoint;