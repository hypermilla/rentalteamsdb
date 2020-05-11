const express = require("express");

const upload = require("./modules/uploader");
const newTeamManager = require("./modules/saveNewRentalTeam");

const router = express.Router(); 

router.get("/", (req, res) => {
    res.render("index");
});

router.post("/upload", (req, res) => {
    console.log("Uploading image..."); 
    res.render("upload", {
        message: newTeamManager.message
    });
    console.log("Rendered uploads page");
    upload(req, res, err => {
        newTeamManager.saveNewRentalTeam(req.file.path);
        //res.send({message: newTeamManager.message});
    });

});

router.get('/newrentalteam', (req, res) => {
    res.send(req.team); 
});


router.use((req, res, next) => {
    res.status(404).send("<h1>Page not found!</h1>");
});

module.exports = router; 