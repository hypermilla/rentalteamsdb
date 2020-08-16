const mongoose = require('mongoose'); 
const Team = mongoose.model('teams'); 

class DataController {
	constructor() {}

	static async fetchTeams(req, res) {
		try {
			const teams = await Team.find({}); 
			console.log('Received teams request and sent back', teams.length, 'teams.');
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
				console.log("Team found for IGN", req.params.ign);
			else
				console.log('No teams found for IGN', req.params.ign);
				return res.send({ teams: "No teams found" }); 

		} catch(error) {
			return res.status(500).send('Error fetching data'); 
		} 
	}
	
	static async fetchTeamById(req, res) {
		try { 
			const team = await Team.findOne({ teamId: req.params.teamId });

			if (team) {
				console.log("Team found for Team ID", req.params.teamId);
				return res.send({ team: team });
			}
			else {
				console.log("No teams found for Team ID", req.params.teamId);
				return res.send({ msg: "No teams found." });
			}
			
		} catch (error) {
			return res.status(500).send('Error fetching data');
		}
	}

	static async fetchTeamByCode(req, res) {
		try {
			// Adjust teamCode to actual length with padding
			// Apparently rental codes can be less than 14 characters, but they always have 7 zeroes in front 
			let teamCode = req.params.teamCode; 
			while (!teamCode.startsWith("0000000")) {
				//teamCode = String(teamCode).padStart(14, '0');
				teamCode = "0" + teamCode;
			}
			console.log("Received request to fetch team by code", req.params.teamCode);
			console.log('Treated code:', teamCode); 
			const team = await Team.findOne({ rentalCode: teamCode });
			if (team) {
				console.log("Team found for code", teamCode);
				return res.send({ team: team });
			}
			else {
				console.log('No teams found for code', teamCode);
				return res.send({ msg: "No teams found." });
			} 
			
		} catch (error) {
			return res.status(500).send('Error fetching data');
		}
	}

	static async updateRentalTeamData(req, res) {
		try { 
			// const team = await Team.findOne({ teamId: req.body.teamId });
			// console.log('Team found by Mongoose:', team.teamId, team.ign); 
			// team.overwrite(req.body.teamData); 
			// const savedTeam = await team.save(); 
			
			let updatedTeam = await Team.findOneAndUpdate(
				{ teamId: req.body.teamData.teamId },
				{ pokemon: req.body.teamData.pokemon },
				{ new: true }
			);

			console.log(updatedTeam);

			res.send({
				msg: 'Rental Team updated successfully!',
				team: updatedTeam 
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
