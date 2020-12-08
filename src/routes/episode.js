const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");


const Episode = require("../models/Episode");
const Character = require("../models/Character");

//@route    POST api/episode
//@desc     Register episode
//@access   Public
router.post(
    "/",
    [
        check("name", "Name is required").not().isEmpty(),
        check("air_date", "air_date is required").not().isEmpty(),
        check("episode", "episode is required").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, air_date, episode, characters } = req.body;
        try {
            episodeObj = new Episode({
                name,
                air_date,
                episode
            });
            if (characters) episodeObj.characters = characters;

            await episodeObj.save();

            res.status(200).json({
                episode: {
                    id: episodeObj.id,
                },
            });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server Error");
        }
    }
);


//@route    GET api/episode
//@desc     Get all episodes
//@access   Public
router.get("/", async (req, res) => {
    try {
        const episodes = await Episode.find();
        res.json(episodes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


//@route    DELETE api/episode
//@desc     Delete episode 
//@access   Public
router.delete('/:id', async (req, res) => {
    try {
        //Remove episode
        await Episode.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Episode deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//@route    PUT api/episodes/characters
//@desc     Add character to episode
//@access   Public
router.put(
    '/:id/characters',
    [
        check("characterId", "Character id is required").not().isEmpty(),
    ],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { characterId } = req.body;
            const character = await Character.findOne({ _id: characterId });
            if (!character) {
                return res.status(500).json({ msg: 'Character not found' });
            }
            const episode = await Episode.findOne({ _id: req.params.id });
            episode.characters.unshift(character);
            await episode.save();

            character.episodes.unshift(req.params.id);
            await character.save();

            res.json(episode);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;