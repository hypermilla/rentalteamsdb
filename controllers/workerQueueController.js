const Queue = require('bull');
const keys = require('../config/keys');
const newTeamController = require('./newTeamController'); 


const createTeamQueue = new Queue ('createRentalTeam', keys.redisURL);

async function addTeamToWorkerQueue (file, teamId) {
    try {
        await createTeamQueue.add({ 
			file: file,
			teamId: teamId
        });
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

module.exports.addTeamToWorkerQueue = addTeamToWorkerQueue; 
