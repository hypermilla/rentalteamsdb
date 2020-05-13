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

router.post("/upload", upload.uploadToS3.array('rentalTeamScreenshot', 1), (req, res, next) => {
    console.log("Uploading image..."); 

    res.render("upload", {
        message: newTeamManager.message
    });

    console.log("Uploaded image to:");
    console.log(req.files[0].location);

    addTeamToWorkerQueue(req.files[0].location);
});

router.get('/newrentalteam', (req, res) => {
    res.send(req.team); 
});


router.use((req, res, next) => {
    res.status(404).send("<h1>Page not found!</h1>");
});

async function addTeamToWorkerQueue (filePath) {
    try {
        await createTeamQueue.add({ 
            file: filePath
        });
        console.log("Added job to Queue! Creating team from image: " + filePath);
    }

    catch (error) {
        console.log(error);
    }
}

createTeamQueue.on ('global:completed', (job, result) => {
    console.log("Job completed!");
    newTeamManager.saveTeamToMongoDB(result);
});


module.exports = router; 