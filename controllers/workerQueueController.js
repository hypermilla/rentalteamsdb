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

const getJobStatus = (jobId) => {
	const myJob = bull.getJob(jobId);
	console.log(myJob);
	return myJob;
}

module.exports.addTeamToWorkerQueue = addTeamToWorkerQueue; 
module.exports.getJobStatus = getJobStatus;
