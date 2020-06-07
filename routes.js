const express = require("express");
const router = express.Router(); 
const path = require('path');
const imageSize = require('image-size');

const keys = require('./config/keys');
const upload = require("./controllers/uploadController");
const newTeamController = require("./controllers/newTeamController");
const workerQueueController = require("./controllers/workerQueueController");

router.get("/api/test", (req, res) => {
	console.log("Server: Got GET Request!");
	res.send({text: "testing!!!"});
});

router.get('/api/fetch_team/:ign', async (req, res) => {
	console.log('Fetch team request:' + req.param.ign);
	const team = await newTeamController.getTeamFromDB(req.params.ign); 
	console.log(team);
	res.send({data: team});
});

router.post ('/api/upload', upload.uploadRentalTeamImage, (req, res, next) => {
	console.log('Uploaded image to AWS', req.file.location);

	const newTeamId = newTeamController.createNewTeamID();
	workerQueueController.addTeamToWorkerQueue(req.file.location, newTeamId);

	res.send({
		newTeamId: newTeamId,
		imagePath: req.file.location
	});
});

router.get('/api/fetch_team/:id', async (req, res) => {
	console.log('Fetch team request:' + req.param.id); 
	const team = await newTeamController.fetchTeamById(req.param.id); 
	res.send({ data: team });
});

router.use((req, res, next) => {
    res.status(404).send("<h1>Page not found! But you reached my server!</h1>");
});

module.exports = router; 

