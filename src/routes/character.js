const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Character = require("../models/Character");
const Location = require("../models/Location");
const Episode = require("../models/Episode");

//@route    POST api/character
//@desc     Register character
//@access   Public
router.post(
    "/",
    [
        check("name", "Name is required").not().isEmpty(),
        check("status", "status is required").not().isEmpty(),
        check("species", "species is required").not().isEmpty(),
        check("type", "type is required").not().isEmpty(),
        check("gender", "gender is required").not().isEmpty(),
        check("image", "image is required").not().isEmpty(),
        check("location", "location id is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, status, species, type, gender, origin, location, image, episodes } = req.body;

        try {
            character = new Character({
                name,
                status,
                species,
                type,
                gender,
                origin,
                location,
                image,
                episodes
            });
            const locationObj = await Location.findOne({ _id: location });
            if (!locationObj) {
                return res.status(500).json({ msg: 'Location not found' });
            }

            if (episodes) character.episodes = episodes;
            if (location) character.location = location;
            if (origin) character.origin = origin;

            await character.save();

            locationObj.residents.unshift(character);
            await locationObj.save();

            res.status(200).json({
                character: {
                    id: character.id,
                },
            });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server Error");
        }
    }
);


//@route    GET api/character
//@desc     Get all characters
//@access   Public
router.get("/", async (req, res) => {
    try {
        const characters = await Character.find();
        res.json(characters);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


//@route    DELETE api/character
//@desc     Delete character 
//@access   Public
router.delete('/:id', async (req, res) => {
    try {
        //Remove Character
        await Character.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Character deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


//@route    PUT api/character/episodes
//@desc     Add episode to character
//@access   Public
router.put(
    '/:id/episodes',
    [
        check("episodeId", "Episode id is required").not().isEmpty(),
    ],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { episodeId } = req.body;
            const episode = await Episode.findOne({ _id: episodeId });
            if (!episode) {
                return res.status(500).json({ msg: 'Episode not found' });
            }
            const character = await Character.findOne({ _id: req.params.id });
            character.episodes.unshift(episode);
            await character.save();

            episode.characters.unshift(character);
            await episode.save();

            res.json(character);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);



module.exports = router;