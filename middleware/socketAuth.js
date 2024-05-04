const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/user');

const socketAuth = async (socket, next) => {

    try {
        const token = socket.handshake && socket.handshake.auth && socket.handshake.auth.token.replace('Bearer ', '')
        decoded = jwt.verify(token, config.env && config.env.SECRET_KEY || '12345678');
        let user = await User.findById(decoded._id)
        if (!user) throw new Error();
        socket.handshake.user = user
        next()
    } catch (e) {
        //throw new Error('unauthorized');
    }
}

module.exports = socketAuth