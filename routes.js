const express = require('express');
const router = express.Router(); 
const path = require('path');

const upload = require("./controllers/uploadController");
const newTeamController = require("./controllers/newTeamController");
const workerQueueController = require("./controllers/workerQueueController");

router.get('/api/fetch_team/:ign', async (req, res) => {
	console.log('Fetch team request:' + req.param.ign);
	const team = await newTeamController.fetchTeamByIgn(req.params.ign); 
	console.log(team);
	res.send({data: team});
});

router.get('/api/fetch_team_by_id/:id', async (req, res) => {
	console.log('Fetch team request:' + req.param.id); 
	const team = await newTeamController.fetchTeamById(req.param.id); 
	res.send({ team: team });
});

router.get('/api/fetch_teams', async (req, res) => {
	console.log('Fetch all teams request:' + req); 
	const teams = await newTeamController.fetchTeamsData(); 
	res.send({ teams });
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

router.get('/api/team_job_status/:jobId', async (req, res) => {
	console.log('Job Status Requested:', req.params.jobId); 
	const status = await workerQueueController.getJobStatus(req.params.jobId);
	res.send({ 
		progress: status.progress, 
		logs: status.logs,
		state: status.state,
		result: status.result,
	});
});

router.get('/api/team_job_results/:jobId', async (req, res) => {
	
});

router.post ('/api/newteam', upload.uploadRentalTeamImage, async (req, res, next) => {
	console.log('Uploaded image to AWS', req.file.location);
	try {
		const newTeamId = await newTeamController.createNewTeamID();
		const newTeamData = await newTeamController.createRentalTeam(req.file.location, newTeamId);

		console.log('Created new team', newTeamData);
		res.send({
			newTeamId: newTeamId,
			imagePath: req.file.location,
			newTeamData: newTeamData
		});
	}
	catch (err) {
		res.send({ msg: err});
	}
});

router.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

router.use((req, res, next) => {
	res.status(404).send("<h1>Page not found! But you reached my server!</h1>");
});

module.exports = router;