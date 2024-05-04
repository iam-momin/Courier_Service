const _ = require('lodash')
const bcrypt = require('bcrypt')
const crypto = require("crypto");

const express = require('express');
const { User } = require('../models/user');
const { Token } = require('../models/token');
const sendEmail = require('../utils/email/sendEmail');

const router = express.Router();


router.get('/email/:email', async(req, res)=>{
    try{
        const user = await User.findOne({email: req.params.email})
        if(!user) return res.status(404).send('Inavid email')
        let token = await Token.findOne({ userId: user._id });
        if (token) await token.deleteOne()
        let resetToken = crypto.randomBytes(32).toString("hex");
        const bcryptSalt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
        await new Token({
            userId: user._id,
            token: hash,
            createdAt: Date.now(),
        }).save();
        
        const baseUrl = process.env.NODE_ENV === "production" ? "https://pickupdrop.herokuapp.com" : "http://localhost:3000"
        const link = `${baseUrl}/recover/passwordReset?token=${resetToken}&id=${user._id}`;
        const sendEmailRes = await sendEmail(user.email,"Password Reset Request",{name: user.name,link: link,},"./template/requestResetPassword.handlebars");
        if(sendEmailRes && sendEmailRes.accepted.length > 0){
            res.status(200).send('Email sent successfully')
        }
    }catch(err){
        res.send(err)
    }
    
})

router.put('/', async (req, res)=>{
    const {userId, token, password} = req.body;
    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) return res.status(401).send("Invalid or expired password reset token");
    
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) return res.status(401).send("Invalid or expired password reset token!");
    
    const bcryptSalt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, Number(bcryptSalt));
    await User.updateOne(
        { _id: userId },
        { $set: { password: hash } },
        { new: true }
    );
    const user = await User.findById({ _id: userId });
    sendEmail(
        user.email,
        "Password Reset Successfully",
        {
        name: user.name,
        },
        "./template/resetPassword.handlebars"
    );
    await passwordResetToken.deleteOne();
    res.send({messsage: "Password updated successfully"})
})


module.exports = router