const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose')

const guestSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    isGuest: {
        type: Boolean,
        required: true,
        default: true
    }
})

guestSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin, isGuest: this.isGuest }, 'jwtPrivateKey');
    return token;
}

const Guest = mongoose.model('User', guestSchema)

function validateGuest(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean().required()
    });

    return schema.validate(user)
}

exports.Guest = Guest;
exports.validateGuest = validateGuest