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

router.post("/upload", async (req, res) => {

    try 
    { 
        console.log("Uploading image..."); 
        res.render("upload", {
            message: newTeamManager.message
        });
        console.log("Rendered uploads page");
        
        await upload(req, res, err => { 
            if (err) {
                console.log("Error uploading file!");
                console.log(err);
                res.sendStatus(500);
            }
            console.log("Uploaded image to: " + req.file.path);
            addTeamToWorkerQueue(req.file.path);

        });
    }

    catch (error) 
    {
        console.log(error);
        return res.sendStatus(500);
    }
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

createTeamQueue.on ('global:completed', (job, result) => {
    console.log("Job completed!");
    newTeamManager.saveTeamToMongoDB(result);
});


module.exports = router; 