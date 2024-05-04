const express = require('express');
const auth = require('../middleware/auth');
const {Chat} = require('../models/chat')

const router = express.Router();

router.get('/me', auth, async (req, res)=>{
    const chats = await Chat.find({customerId: req.user._id})
    res.send(chats)
})

router.get('/', auth, async (req, res)=>{
    const user = req.user
    if(user.isAdmin){
        const chats = await Chat.find({})
        res.send(chats)
    }else{
        res.status(401).send('unauthorized');
    }
})

router.put('/read', auth, async(req, res)=>{
    const ids = req.body.messageIds;
    const messages = await Chat.updateMany({ _id: { $in: ids } }, {$set: {isRead: true}}, {multi: true});
    res.send(messages)
})

module.exports = router;
