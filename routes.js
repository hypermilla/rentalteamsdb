const express = require("express");
const router = express.Router(); 
const Queue = require('bull');
const path = require('path');

const keys = require('./config/keys');
const upload = require("./modules/uploader");
const newTeamManager = require("./modules/saveNewRentalTeam");

const createTeamQueue = new Queue ('createRentalTeam', keys.REDIS_URL);


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
        console.log(req.file.path);
        addTeamToWorkerQueue(req.file.path);
    });

});

router.get('/newrentalteam', (req, res) => {
    res.send(req.team); 
});


router.use((req, res, next) => {
    res.status(404).send("<h1>Page not found!</h1>");
});

async function addTeamToWorkerQueue (filePath) {
    await createTeamQueue.add({ file: filePath });
    console.log("Added job to Queue! Creating team from image: " + filePath);
}

createTeamQueue.process( async job => {
    console.log(job.data.file);
    await newTeamManager.saveNewRentalTeam(job.data.file);
    console.log("Job finished");
});

module.exports = router; 