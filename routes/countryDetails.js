const express = require('express');
const { validateContry, Country } = require('../models/countryDetaile');

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateContry(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let fromCountry = await Country.findOne({ from: req.body.from })
    if (fromCountry && fromCountry.to[req.body.to]) return res.status(400).send("to Country already exist")
    if (fromCountry) {
        const { to, kgThreshold, literTHreshold, perKg, perLiter, wearhouse, shipping } = req.body
        fromCountry.to = { ...fromCountry.to, [to]: { kgThreshold, literTHreshold, perKg, perLiter, wearhouse, shipping } }
        fromCountry.save()
    } else {
        const { from, to, kgThreshold, literTHreshold, perKg, perLiter, wearhouse, shipping } = req.body
        if (from && to && kgThreshold && literTHreshold && perKg) {
            let toArray = { [to]: { kgThreshold, literTHreshold, perKg, perLiter, wearhouse, shipping } }
            let toArray2 = { [from]: { kgThreshold, literTHreshold, perKg, perLiter, wearhouse, shipping } }
            fromCountry = new Country({ from, to: toArray })
            let fromCountry2 = new Country({ from: to, to: toArray2 })
            fromCountry.save()
            fromCountry2.save()
        } else {
            res.status(400).send('Bad request')
            return
        }
    }
    res.send(fromCountry)
})

router.get('/', async (_req, res) => {
    const allCountries = await Country.find().sort({ "listOrder": 1 });
    res.send(allCountries)
})


module.exports = router

// {
// 	"from": "UK",
// 	"to": "EU",
// 	"kgThreshold": 300,
// 	"literTHreshold": 100,
// 	"perKg": 1.40,
// 	"perLiters": 0.10,
// 	"wearhouse": 1,
// 	"shipping": 5
// }