const { string } = require('joi');
const Joi = require('joi');
const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
        unique: true
    },
    to: {
        type: Object,
        required: true
    }
})

const Country = mongoose.model('CountryDetail', countrySchema)

function validateContry(country) {
    const schema = Joi.object({
        from: Joi.string().required(),
        to: Joi.string().required(),
        kgThreshold: Joi.number(),
        literTHreshold: Joi.number(),
        perKg: Joi.number(),
        perLiter: Joi.number(),
        listOrder: Joi.number(),
        // wearhouse: Joi.number(),
        // shipping: Joi.number(),

    })
    return schema.validate(country)
}

exports.Country = Country;
exports.validateContry = validateContry;