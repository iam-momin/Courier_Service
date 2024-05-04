const Joi = require('joi');
const mongoose = require('mongoose');

const claimFormSchema = new mongoose.Schema({
    claimStatus: {
        type: Object,
    },
    claimDetails: {
        type: Object,
        required: true,
    },

}, { timestamps: true })

const Claim = mongoose.model('Claim', claimFormSchema)

function validateClaimDetail(claim) {
    const schema = Joi.object({
        claimStatus: Joi.object(),
        claimDetails: Joi.object()
    })
    return schema.validate(claim)
}

exports.Claim = Claim
exports.validateClaimDetail = validateClaimDetail