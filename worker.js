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
			let teamData = {};
			teamData.teamId = team.teamId; 

			job.log("Extracting image slices from screenshot...");
			await team.extractImages(job.data.file, folder);

			job.log("Reading IGN from image...");
			teamData.ign = await team.getIgnData();

			job.log("Reading Rental Code from image...");
			teamData.rentalCode = await team.getRentalCodeData(); 

			job.log("Reading Team Info from image...");
			teamData.pokemon = []; 

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
				pkmn.isShiny = false; 
				pkmn.form = ''; 

				teamData.pokemon.push(pkmn); 
			}
			console.log('Data:', teamData); 
		
			job.log("Rental Team Data acquired! Finalizing process...");
			await team.deleteTeamFolder(); 
			
			const savedStatus = await team.saveRentalTeamData(teamData); 
            return { teamData, savedStatus }; 
        });
	}
	catch (err) {
		console.log(err)
		return err; 
    }

}

throng({ workers, start });