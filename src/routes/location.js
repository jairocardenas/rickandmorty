const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Location = require("../models/Location");

//@route    POST api/location
//@desc     Register location
//@access   Public
router.post(
    "/",
    [
        check("name", "Name is required").not().isEmpty(),
        check("type", "Type is required").not().isEmpty(),
        check("dimension", "Dimension is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, type, dimension, residents } = req.body;
        try {
            location = new Location({
                name,
                type,
                dimension
            });
            if (residents) location.residents = residents;

            await location.save();

            res.status(200).json({
                location: {
                    id: location.id,
                },
            });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server Error");
        }
    }
);


//@route    GET api/location
//@desc     Get all locations
//@access   Public
router.get("/", async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


//@route    DELETE api/location
//@desc     Delete location 
//@access   Public
router.delete('/:id', async (req, res) => {
    try {
        //Remove Location
        await Location.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Location deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;