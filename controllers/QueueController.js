const bull = require('bull');
const keys = require('../config/keys');

const DataController = require('./DataController'); 

createTeamQueue = new bull ('createRentalTeam', keys.redisURL);

createTeamQueue.on ('global:completed', async (job, result) => {
	try {
		console.log("Job finished!");
		//const saved = await DataController.saveRentalTeamData(result); 
		//console.log('Saved team to db');
	} 
	catch(err) {
		console.log(err);
	}
});

createNewTeamJob = async (req, res, next) => {
	//Called after the upload function is finished. 
	//Starts Team Creation Job: creates ID and adds job to Queue.
	console.log('Uploaded image to AWS', req.file.location);

	try { 
		const crypto = require('crypto');
		const teamId = await crypto.randomBytes(20).toString('hex');

		console.log("Created team id", teamId);

		await createTeamQueue.add({ 
			file: req.file.location,
			teamId: teamId
		}, { 
			jobId: teamId 
		});

		console.log('Added job to Queue!', 'ID:', teamId);

		res.send({
			newTeamId: teamId,
			imagePath: req.file.location
		});
	} 
	catch (error) {
		console.log(error);
	}
}
	
getJobStatus = async (req, res) => {
	//Fetches Job Status from worker queue
	try {
		const myJob = await createTeamQueue.getJob(req.params.jobId);

		const progress = await myJob.progress();
		const logs = await createTeamQueue.getJobLogs(req.params.jobId, 0, 10);
		const result = myJob.returnvalue;
		const state = await myJob.getState();
	
		const status = {
			progress: progress,
			logs: logs,
			state: state,
			result: result
		};
	
		console.log('Job Status Requested:', req.params.jobId); 
	
		res.send({ 
			progress: status.progress, 
			logs: status.logs,
			state: status.state,
			result: status.result,
		});
	} 
	catch(error) {
		res.status(500).send('Could not find the required JobID');
	}
}

module.exports = { getJobStatus, createNewTeamJob };