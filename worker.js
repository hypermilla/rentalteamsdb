//Keys
const keys = require('./config/keys');

//MongoDB
const mongoose = require("mongoose");
mongoose.connect(keys.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
require("./models/Teams");

//Controllers
const TeamCreationController = require('./controllers/TeamCreationController');
const DataController = require('./controllers/DataController'); 

//Queue 
const throng = require('throng');
const Queue = require('bull'); 

let REDIS_URL = keys.redisURL;
let workers = process.env.WEB_CONCURRENCY || 1; 
let maxJobsPerWorker = 5;

async function start() 
{
    try {
        console.log("Worker started!");
        let workQueue = new Queue('createRentalTeam', REDIS_URL);
    
        workQueue.process(maxJobsPerWorker, async (job) => {
			console.log("Performing job", job.id);
			const team = new TeamCreationController(job.id, job.data.file);
			
			job.log("Setting up...");
			const folder = await team.createTeamFolder();
			let data = {};
			data.teamId = team.teamId; 

			job.log("Extracting image slices from screenshot...");
			await team.extractImages(job.data.file, folder);

			job.log("Reading IGN from image...");
			data.ign = await team.getIgnData();

			job.log("Reading Rental Code from image...");
			data.rentalCode = await team.getRentalCodeData(); 

			job.log("Reading Team Info from image...");
			data.pokemon = []; 

			for (let n = 1; n <= 6; n++) {
				const pkmnNumber = n.toString().padStart(2, '0');
				job.log('Reading Pokémon ' + pkmnNumber + ' data...');
				
				const { type1, type2 } = await team.getPokemonTypeData(pkmnNumber); 
				const { name, level, ability, item } = await team.getPokemonInfoData(pkmnNumber); 
				const moveset = await team.getPokemonMovesData(pkmnNumber);
				
				let pkmn = {};
				pkmn.name = name; 
				pkmn.type1 = type1;
				if (type2) 
					pkmn.type2 = type2; 
				pkmn.item = item;
				pkmn.level = level;
				pkmn.ability = ability;
				pkmn.moveset = moveset;

				data.pokemon.push(pkmn); 
			}
			console.log('Data:', data); 
		
			job.log("Rental Team Data acquired! Finalizing process...");
			await team.deleteTeamFolder(); 
			
			savedStatus = await team.saveRentalTeamData(data); 
			console.log(savedStatus);
			data.savedStatus = savedStatus; 
            return data; 
        });
	}
	catch (err) {
    	console.log(err)
    }

}

throng({ workers, start });