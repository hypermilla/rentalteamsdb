const vision = require('@google-cloud/vision');

const bull = require('bull');
const fs = require('fs');
const rimraf = require('rmfr'); 
const util = require('util');



class TeamCreationController {
	constructor(teamId, imageUrl) {
		this.teamId = teamId;
		this.imagePath = imageUrl; 

		const keys = require("../config/keys"); 
		let googleVisionKey;

		if (process.env.NODE_ENV === 'production')
			googleVisionKey = JSON.parse(keys.googlevisionkey);
		else googleVisionKey = keys.googlevisionkey;

		this.client = new vision.ImageAnnotatorClient({ credentials: googleVisionKey }); 
	}

	async createTeamFolder() {
		try { 
			this.teamFolder = './temp/team_' + this.teamId; 

			const mkDirAsync = util.promisify(fs.mkdir); 
			await mkDirAsync(this.teamFolder);

			console.log('Created team folder', this.teamFolder);
		}
		catch (error) {
			if (error.code == 'EEXIST')
				return this.teamFolder;
			else return null; 
		}
	}

	async deleteTeamFolder () {
		try { 
			if (this.teamFolder) {
				await rimraf(this.teamFolder);
				console.log('Team folder', this.teamFolder, 'successfully deleted');
			} 
		} catch (error) {
			if (error.code == 'EEXIST')
				console.log("Team Directory doesn't exist."); 
			else console.log("Error deleting folder: " + error);
		}
	}

	async saveRentalTeamData(rentalTeamData) {
		try { 
			const mongoose = require('mongoose'); 
			const Team = mongoose.model('teams'); 

			const existingTeam = await Team.findOne({ rentalCode: rentalTeamData.rentalCode });
	
			if (existingTeam && existingTeam != undefined) {
				console.log('Team already exists');
				return false;
			}
			else {
				await new Team({ 
					teamId: rentalTeamData.teamId,
					ign: rentalTeamData.ign,
					rentalCode: rentalTeamData.rentalCode,
					pokemon: rentalTeamData.pokemon
				}).save();
				console.log('Team saved to db.', rentalTeamData.rentalCode);
				return true;
			}
		} catch (error) {
			console.log(error);
			return error; 
		}
	}

	async adjustContrast (imagePath, outputFolder) {
		try {
			const jimp = require('jimp');
			const outputPath = outputFolder + "/team.jpg";
		
			const image = await jimp.read (imagePath);
			await image.contrast(0.4);
			await image.writeAsync(outputPath);
			
			return await outputPath;
		} 
		catch (error) {
			console.log ("Error creating new image with high contrast.", error);
		}
	}

	async extractImages() 
	{
		//Breaks rental team screenshot in different images to be read by OCR 
		try { 
			const sharp = require('sharp');

			const adjustedImage = await this.adjustContrast(this.imagePath, this.teamFolder); 
			const teamImage = sharp(adjustedImage);

			//IGN section image
			await teamImage.extract({ left: 350, top: 585, width: 190, height: 40 })
			.toFile(this.teamFolder + "/ign.jpg", function (err){ 
				console.log("Saved IGN Image!");
			});

			//Rental Code section image
			await teamImage.extract({ left: 545, top: 630, width: 395, height: 45 })
			.toFile(this.teamFolder + "/rentalcode.jpg", function (err) { 
				console.log("Saved Rental Code Image!");
			});

			//Pokemon 01 Info section image
			await teamImage.extract({ left: 80, top: 85, width: 260, height: 110 })
			.toFile(this.teamFolder + "/pokemon_01_info.jpg", function (err) { 
				console.log("Saved Pokemon 01 Info Image!");
			});
			
			//Pokemon 02 Type section image
			await teamImage.extract({ left: 240, top: 20, width: 100, height: 70 })
			.toFile(this.teamFolder + "/pokemon_01_type.jpg", function (err) { 
				console.log("Saved Pokemon 01 Type Image!");
			});
			
			//Pokemon 01 Moves section image
			await teamImage.extract({ left: 395, top: 20, width: 220, height: 175 })
			.toFile(this.teamFolder + "/pokemon_01_moves.jpg", function (err) { 
				console.log("Saved Pokemon 01 Moves Image!");
			});

			//Pokemon 02 Info section image
			await teamImage.extract({ left: 80, top: 275, width: 260, height: 110 })
			.toFile(this.teamFolder + "/pokemon_02_info.jpg", function (err) { 
				console.log("Saved Pokemon 02 Info Image!");
			});

			//Pokemon 02 Type section image
			await teamImage.extract({ left: 240, top: 200, width: 100, height: 70 })
			.toFile(this.teamFolder + "/pokemon_02_type.jpg", function (err) { 
				console.log("Saved Pokemon 02 Type Image!");
			});

			//Pokemon 02 Moves section image
			await teamImage.extract({ left: 395, top: 205, width: 220, height: 175 })
			.toFile(this.teamFolder + "/pokemon_02_moves.jpg", function (err) { 
				console.log("Saved Pokemon 02 Moves Image!");
			});	
			
			
			//Pokemon 03 Info section image
			await teamImage.extract({ left: 80, top: 465, width: 260, height: 110 })
			.toFile(this.teamFolder + "/pokemon_03_info.jpg", () => { 
				console.log("Saved Pokemon 03 Info Image!");
			});

			//Pokemon 03 Type section image
			await teamImage.extract({ left: 240, top: 395, width: 100, height: 70 })
			.toFile(this.teamFolder + "/pokemon_03_type.jpg", function (err) { 
				console.log("Saved Pokemon 03 Type Image!");
			});

			//Pokemon 03 Moves section image
			await teamImage.extract({ left: 395, top: 395, width: 230, height: 175 })
			.toFile(this.teamFolder + "/pokemon_03_moves.jpg", function (err) { 
				console.log("Saved Pokemon 03 Moves Image!");
			});	
			

			//Pokemon 04 Info section image
			await teamImage.extract({ left: 665, top: 85, width: 260, height: 110 })
			.toFile(this.teamFolder + "/pokemon_04_info.jpg", function (err) { 
				console.log("Saved Pokemon 04 Info Image!");
			});

			//Pokemon 04 Type section image

			await teamImage.extract({ left: 820, top: 20, width: 100, height: 70 })
			.toFile(this.teamFolder + "/pokemon_04_type.jpg", function (err) { 
				console.log("Saved Pokemon 04 Type Image!")
			});

			//Pokemon 04 Moves section image
			await teamImage.extract({ left: 980, top: 20, width: 220, height: 175 })
			.toFile(this.teamFolder + '/pokemon_04_moves.jpg', function (err) { 
				console.log("Saved Pokemon 04 Moves Image!");
			});

			//Pokemon 05 Info section image
			await teamImage.extract({ left: 665, top: 275, width: 260, height: 110 })
			.toFile(this.teamFolder + "/pokemon_05_info.jpg", function (err) { 
				console.log("Saved Pokemon 05 Info Image!");
			});

			//Pokemon 05 Type section image
			await teamImage.extract({ left: 820, top: 200, width: 100, height: 70 })
			.toFile(this.teamFolder + "/pokemon_05_type.jpg", function (err) { 
				console.log("Saved Pokemon 05 Type Image!");
			});

			//Pokemon 05 Moves section image
			await teamImage.extract({ left: 980, top: 205, width: 220, height: 175 })
			.toFile(this.teamFolder + "/pokemon_05_moves.jpg", function (err) { 
				console.log("Saved Pokemon 05 Moves Image!");
			});

			//Pokemon 06 Info section image
			await teamImage.extract({ left: 665, top: 465, width: 260, height: 110 })
			.toFile(this.teamFolder + "/pokemon_06_info.jpg", function (err) { 
				console.log("Saved Pokemon 06 Info Image!");
			});

			//Pokemon 06 Type section image
			await teamImage.extract({ left: 820, top: 395, width: 100, height: 70 })
			.toFile(this.teamFolder + "/pokemon_06_type.jpg", function (err) { 
				console.log("Saved Pokemon 06 Type Image!");
			});
			
			//Pokemon 06 Moves section image
			await teamImage.extract({ left: 980, top: 395, width: 220, height: 175 })
			.toFile(this.teamFolder + "/pokemon_06_moves.jpg", function (err) { 
				console.log("Saved Pokemon 06 Moves Image!");
			});
			
		} catch (error) { 
			console.log("Error extracting images: ", error);
		}
	}

	async getIgnData() {
		try {
			const results = await this.client.textDetection(this.teamFolder + "/ign.jpg");
			if (results == null) {
				//TODO: Return an error to end the job and pass to the client
				throw "Could not read Rental Team data from this image.";
			}
			const ign = results[0].textAnnotations[0].description.replace(/(\r\n|\n|\r)/gm, "");

			return ign;
		} 
		catch(error) {
			throw error; 
		}
	}

	async getRentalCodeData() {
		try {
			const results = await this.client.textDetection(this.teamFolder + "/rentalcode.jpg");
			if (results == null) {
				throw "Could not read Rental Team data from this image.";
			}

			return results[0].textAnnotations[0].description
				.replace(/(\r\n|\n|\r)/gm, "")
				.replace(/\s/g, '');
		} 
		catch (err) {
			throw err; 
		}
	}

	async getPokemonTypeData (pkmnNumber) {
		try {
			const pkmnImagePath = this.teamFolder + '/pokemon_' + pkmnNumber + '_type.jpg'; 
			const results = await this.client.textDetection(pkmnImagePath);
			if (results == null) {
				throw "Could not read Rental Team data from this image.";
			}

			let pkmnData = {}; 
			const detections = results[0].textAnnotations;
			pkmnData.type1 = detections[1].description.replace(/(\r\n|\n|\r)/gm, "");
					
			if ( detections[2] != null ) {
				pkmnData.type2 = detections[2].description.replace(/(\r\n|\n|\r)/gm, "");
			}

			return pkmnData; 
		
		} catch (error) {
			throw error; 
		}
	}

	async getPokemonInfoData (pkmnNumber) {

		try {
			const pkmnImagePath = this.teamFolder + '/pokemon_' + pkmnNumber + '_info.jpg'; 
			const results = await this.client.textDetection(pkmnImagePath);

			if (results == null) {
				throw 'No detections were possible from this image';
			}

			const detections = results[0].textAnnotations;
	
			let pokemonInfo = detections[0].description.split("\n",3);
			let nameLvlInfo = pokemonInfo[0].split(" ");

			let level = nameLvlInfo.pop();
			nameLvlInfo.pop();
			const checkForGenderInfo = nameLvlInfo.pop();

			let pkmnData = {}; 

			if (checkForGenderInfo.length < 2) 
				pkmnData.name = nameLvlInfo.toString();
			else {
				nameLvlInfo.push(checkForGenderInfo);
				pkmnData.name = nameLvlInfo.toString();
			}

			pkmnData.level = level; 
			pkmnData.ability = pokemonInfo[1];
			pkmnData.item = pokemonInfo[2];

			return pkmnData; 
		}
		catch (error) {
			throw error; 
		}
	}

	async getPokemonMovesData (pkmnNumber) {
		try {
			const pkmnImagePath = this.teamFolder + '/pokemon_' + pkmnNumber + '_moves.jpg'; 
			const results = await this.client.textDetection(pkmnImagePath)

			if (results == null){
				throw 'Could not detect Pokémon info from this image.'; 
			}

			const detections = results[0].textAnnotations;
			const pkmnMoves = detections[0].description.split("\n",4);
		
			return pkmnMoves;
		}
		catch (error) {
			throw error; 
		}
	}
}

module.exports = TeamCreationController;