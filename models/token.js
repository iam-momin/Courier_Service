const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300000,
  },
});

function validateToken(user){
    const schema = Joi.object({
        userId: Joi.string().required(),
        email: Joi.email().required(),
        createdAt: Joi.string().required()

    });

    return schema.validate(user)
}

exports.Token = mongoose.model("Token", tokenSchema);
exports.validateToken = validateToken