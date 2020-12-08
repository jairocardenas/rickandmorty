const express = require("express");
const router = express.Router();

//@route    GET api
//@desc     Home route
//@access   Public
router.get("/", async (req, res) => {

    res.status(200).send({
        "character": "http://localhost:5000/api/characters",
        "location": "http://localhost:5000/api/locations",
        "episode": "http://localhost:5000/api/episodes"
    });
});

module.exports = router;