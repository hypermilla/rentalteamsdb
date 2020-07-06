const bull = require('bull');
const keys = require('../config/keys');
const newTeamController = require('./newTeamController'); 


const createTeamQueue = new bull ('createRentalTeam', keys.redisURL);

async function addTeamToWorkerQueue (file, teamId) {
    try {
        await createTeamQueue.add({ 
			file: file,
			teamId: teamId
        }, { jobId: teamId });
		console.log("Added job to Queue! Creating team from image: " + file);
    }

    catch (error) {
        console.log(error);
    }
}

createTeamQueue.on ('global:completed', (job, result) => {
    console.log("Job completed!", job);
    newTeamController.saveTeamToMongoDB(result);
});

const getJobStatus = async (jobId) => {
	console.log("Getting Job status from ID", jobId);
	const myJob = await createTeamQueue.getJob(jobId);

	const progress = await myJob.progress();
	const logs = await createTeamQueue.getJobLogs(jobId, 0, 10);
	const result = myJob.returnvalue;
	const state = await myJob.getState();
	console.log(progress);
	console.log(logs);
	const status = {
		progress: progress,
		logs: logs,
		state: state,
		result: result
	};
	return status;
}

module.exports.addTeamToWorkerQueue = addTeamToWorkerQueue; 
module.exports.getJobStatus = getJobStatus;
