const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/user');

const auth = async (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '')

    try {
        decoded = jwt.verify(token, config.env && config.env.SECRET_KEY || '12345678');

        let user = await User.findById(decoded._id)
        if (!user) throw new Error();
        req.user = user
        next()
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
}

module.exports = auth