const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },
    senderId: {
        type: ObjectId,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
},{timestamps: true})

const Chat = mongoose.model('Chat', chatSchema)

module.exports.Chat = Chat;