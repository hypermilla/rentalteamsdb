const throng = require('throng');
const Queue = require('Bull'); 

const keys = require('./config/keys');

const teamManager = require('./modules/saveNewRentalTeam');

let REDIS_URL = keys.redisURL;

let workers = process.env.WEB_CONCURRENCY || 1; 
let maxJobsPerWorker = 5;


function start() 
{
    console.log("Worker started!");

    let workQueue = new Queue('createRentalTeam', REDIS_URL);

    workQueue.process(maxJobsPerWorker, async (job) => {
        console.log(job.data.file);
        const data = await teamManager.createRentalTeam(job.data.file);
        console.log("Job finished");
        return data; 
    });
}

throng({ workers, start });