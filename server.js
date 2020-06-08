const express = require("express"); 
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const keys = require("./config/keys");
const routes = require("./routes.js");
require("./models/Team"); 
const upload = require("./controllers/uploadController");
const newTeamController = require("./controllers/newTeamController");
const workerQueueController = require("./controllers/workerQueueController");

mongoose.connect(keys.mongoURI);

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));
// app.use(routes);

app.get("/api/test", (req, res) => {
	console.log("Server: Got GET Request!");
	res.send({text: "testing!!!"});
});

app.get('/api/fetch_team/:ign', async (req, res) => {
	console.log('Fetch team request:' + req.param.ign);
	const team = await newTeamController.getTeamFromDB(req.params.ign); 
	console.log(team);
	res.send({data: team});
});

app.get('/api/fetch_team_by_id/:id', async (req, res) => {
	console.log('Fetch team request:' + req.param.id); 
	const team = await newTeamController.fetchTeamById(req.param.id); 
	res.send({ team: team });
});

app.post ('/api/upload', upload.uploadRentalTeamImage, (req, res, next) => {
	console.log('Uploaded image to AWS', req.file.location);

	const newTeamId = newTeamController.createNewTeamID();
	workerQueueController.addTeamToWorkerQueue(req.file.location, newTeamId);

	res.send({
		newTeamId: newTeamId,
		imagePath: req.file.location
	});
});

app.post ('/api/newteam', upload.uploadRentalTeamImage, async (req, res, next) => {
	console.log('Uploaded image to AWS', req.file.location);
	try {
		const newTeamId = await newTeamController.createNewTeamID();
		const newTeamData = await newTeamController.createRentalTeam(req.file.location, newTeamId);
		console.log('Generated new team', newTeamData);
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

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.use((req, res, next) => {
	res.status(404).send("<h1>Page not found! But you reached my server!</h1>");
});







const PORT = keys.port; 
app.listen(PORT, () => {
    console.log("Server is running on port" + PORT);
});