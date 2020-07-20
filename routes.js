// Controllers
const { 
	QueueController, 
	TeamCreationController, 
	DataController, 
	UploadController 
} = require('./controllers');

const express = require('express');
const router = express.Router(); 
const path = require('path'); 

// Fetching Data from MongoDB 
router.get('/api/fetch_teams', DataController.fetchTeams);
router.get('/api/fetch_team/:ign', DataController.fetchTeamByIgn);
router.get('/api/fetch_team_by_id/:id', DataController.fetchTeamById);

// Updating Data in MongoDB
router.post('/api/update_team', DataController.updateRentalTeamData);

// New Team Creation
router.post ('/api/upload', UploadController.single('rentalTeamScreenshot'), QueueController.createNewTeamJob);
router.get('/api/team_job_status/:jobId', QueueController.getJobStatus);



// For everything else 
router.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

router.use((req, res, next) => {
	res.status(404).send("<h1>Page not found! But you reached my server!</h1>");
});

module.exports = router;