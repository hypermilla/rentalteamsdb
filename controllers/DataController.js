const mongoose = require('mongoose'); 
const Team = mongoose.model('teams'); 

class DataController {
	constructor() {}

	static async fetchTeams(req, res) {
		try {
			const teams = await Team.find({}); 
			return res.send({ teams: teams });
		} catch (error) {
			return res.send({ error });  
		}
	}
	
	static async fetchTeamByIgn(req, res) {
		try {
			console.log('Fetch teams by IGN request:', req.params.ign); 
			const team = await Team.findOne({ ign: req.params.ign });
			if (team)
				console.log("Team found:", team);
			else
				return res.send({ teams: "No teams found" }); 

		} catch(error) {
			return res.status(500).send('Error fetching data'); 
		} 
	}
	
	static async fetchTeamById(req, res) {
		try {
			const mongoose = require('mongoose'); 
			const Team = mongoose.model('teams'); 
		
			const team = await Team.findOne({ id: id });
			
			return res.send({ team });
		} catch (error) {
			return res.status(500).send('Error fetching data');
		}
	}

	static async updateRentalTeamData(req, res) {
		try {
			console.log(req.body); 
			const team = await Team.findOne({ teamId: req.body.teamId });
			console.log('Team found by Mongoose:', team); 
			team.overwrite(req.body.teamData); 
			await team.save(); 

			res.send({
				msg: 'Rental Team updated successfully!',
				team: team 
			})
			
		} catch (error) {
			res.status(500).send('Could not update team data'); 
		}
	}

	static async saveRentalTeamData(rentalTeamData) {
		try { 
			const existingTeam = await Team.findOne({ rentalCode: rentalTeamData.rentalCode });
	
			if (existingTeam && existingTeam != undefined) {
				console.log('Team already exists');
				return false;
			}
			else {
				await new Team({ 
					teamId: rentalTeamData.id,
					ign: rentalTeamData.ign,
					rentalCode: rentalTeamData.rentalCode,
					pokemon: rentalTeamData.pokemon
				}).save();
				console.log('Team saved');
				return true;
			}
		} catch (error) {
			console.log(error);
			return error; 
		}
	}
}

module.exports = DataController;
