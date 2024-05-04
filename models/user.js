const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
    },
    password: {
        type: String,
        // required: true,
        minlength: 8,
        maxlength: 255
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    isGuest: {
        type: Boolean,
        required: true,
        default: false
    },
    firstname: {
        type: String,
        min: 3,
    },
    lastname: {
        type: String,
        min: 3,
    },
    address1: {
        type: String,
        min: 3,
    },
    address2: {
        type: String,
    },
    city: {
        type: String,
        min: 3,
    },
    postalCode: {
        type: String,
    },
    phoneNo: {
        type: String,
        min: 3,
    },
    country: {
        type: Object,
    },
    preferredCurrency: {
        type: Object,
    },
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin, isGuest: this.isGuest }, config.env && config.env.SECRET_KEY || '12345678');
    return token;
}

userSchema.methods.getPasswordHash = async function () {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(this.password, salt)
    if (!password) throw new Error('Something went wrong.')
    return password;
}

userSchema.statics.authenticateUser = async (authorizationKey) => {
    try {
        decoded = jwt.verify(authorizationKey, config.env && config.env.SECRET_KEY || '12345678');
    } catch (e) {
        throw new Error('unauthorized');
    }

    return await this.User.findById(decoded._id)
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;

    return userObject;
}

const User = mongoose.model('User', userSchema)

function validateUser(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean().required(),
        firstname: Joi.string().min(3),
        lastname: Joi.string().min(3),
        address1: Joi.string().min(3),
        address2: Joi.string().allow(''),
        city: Joi.string().min(3),
        postalCode: Joi.string().allow(''),
        phoneNo: Joi.string().min(3),
        country: Joi.object(),
        preferredCurrency: Joi.object(),

    });

    return schema.validate(user)
}

exports.User = User;
exports.validateUser = validateUser