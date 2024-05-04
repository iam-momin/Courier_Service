const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res.send({token, isAdmin: user.isAdmin});
});

router.get('/', auth, async (req, res) => {
  // let decoded = ''
  // try {
  //     decoded = jwt.verify(req.headers.authorization, config.env && config.env.SECRET_KEY || '12345678');
  // } catch (e) {
  //     return res.status(401).send('unauthorized');
  // }
  // let user = req.user
  // res.send({isAdmin: user.isAdmin, isGuest: user.isGuest, name: user.name})
  res.send(req.user)

})

router.get('/admin', auth, async (req, res) => {
  if(!req.user.isAdmin) return res.status(401).send('unauthorized');
  res.send(req.user)

})

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required()
  });

  return schema.validate(req);
}

module.exports = router; 
