const throng = require('throng');
const Queue = require('bull'); 

const keys = require('./config/keys');

const newTeam = require('./controllers/newTeamController');

let REDIS_URL = keys.redisURL;

let workers = process.env.WEB_CONCURRENCY || 1; 
let maxJobsPerWorker = 5;


async function start() 
{
    try {
        console.log("Worker started!");

        let workQueue = new Queue('createRentalTeam', REDIS_URL);
    
        workQueue.process(maxJobsPerWorker, async (job) => {
			console.log("Performing job", job.id, job.data.file);
			await job.log("Setting up...");
			//const data = await newTeam.createRentalTeam(job.data.file, job.data.teamId);
			const folder = await newTeam.createTeamFolder(job.data.teamId);
			await job.log("Extracting images...");
			await newTeam.extractImages(job.data.file, folder);
			await job.log("Reading text from images...");
			const data = await newTeam.getVisionData(job.data.teamId, folder);
			await job.log("Finished generating team data!");
            console.log("Job finished", data);
            return data; 
        });
    }

    catch (err) {
        console.log(err);
    }

}

throng({ workers, start });