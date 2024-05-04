const express = require('express');
const { validateParcelPoint, ParcelPoint } = require('../models/parcelPoint')

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateParcelPoint(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let parcelPointExist = await ParcelPoint.findOne({ parcelPoint: req.body.parcelPoint, country: req.body.country })
    if (parcelPointExist) res.status(401).send({ message: 'Parcel point already exist' })
    if (!parcelPointExist) {
        let parcelPoint = new ParcelPoint({ ...req.body });
        await parcelPoint.save();
        res.send({ message: "Successful" })
    }
})

router.get('/', async (_req, res) => {
    const allParcelPoints = await ParcelPoint.find()
    res.send(allParcelPoints)
})


module.exports = router