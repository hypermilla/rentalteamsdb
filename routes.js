const express = require("express");
const router = express.Router(); 
const Queue = require('bull');
const path = require('path');

const keys = require('./config/keys');
const upload = require("./modules/uploader");
const newTeamManager = require("./modules/saveNewRentalTeam");

const createTeamQueue = new Queue ('createRentalTeam', keys.redisURL);

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/api/fetch_team/:ign", async (req, res) => {
	console.log("Fetch team request:" + req.param.ign);
	const team = await newTeamManager.getTeamFromDB(req.params.ign); 
	console.log(team);
	res.send({data: team});
});


router.get("/api/test", (req, res) => {
	console.log("Server: Got GET Request!");
	res.send({text: "testing!!!"});
});

router.get("/test", (req, res) => {
	res.send("<h1>You reached my server!</h1>");
});

router.post("/api/upload", (req, res, next) => {
	res.send({ message: "Uploading..." });
	console.log("Uploading image..."); 
	next('route');
});

router.post ("/api/upload", upload.uploadToS3.array('rentalTeamScreenshot', 1), (req, res, next) => {
	console.log("Uploaded image to:");
    console.log(req.files[0].location);
	addTeamToWorkerQueue(req.files[0].location);
	res.send({ message: "Image uploaded!" });
});

router.use((req, res, next) => {
    res.status(404).send("<h1>Page not found! But you reached my server!</h1>");
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