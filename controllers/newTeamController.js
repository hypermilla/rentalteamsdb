const vision = require('@google-cloud/vision');
const crypto = require('crypto');
const fs = require('fs');
const util = require('util');
const path = require('path');
const bull = require('bull');
require("../models/Team"); 

const keys = require("../config/keys"); 
const { LexModelBuildingService } = require('aws-sdk');

let googleVisionKey;

if (process.env.NODE_ENV === 'production') {
    googleVisionKey = JSON.parse(keys.googlevisionkey);
}
else {
    googleVisionKey = keys.googlevisionkey;
}

const client = new vision.ImageAnnotatorClient({
    credentials: googleVisionKey
}); 


function createNewTeamID() 
{
    //Create team ID
    const teamId = crypto.randomBytes(20).toString('hex');
    console.log("Created new Team ID: " + teamId);

    return teamId;
}

async function createTeamFolder (teamId) {
    //Create team image directory 
    const teamFolder = "./temp/team_" + teamId; 
    const mkDirAsync = util.promisify(fs.mkdir); 

    try 
    { 
        await mkDirAsync(teamFolder);
        console.log("Created team folder without errors: " + teamFolder); 
        return teamFolder;
    }

    catch (error)
    {
        if (error.code == 'EEXIST') 
        {
            console.log("Created team folder: " + teamFolder); 
            return teamFolder;
        }
        else 
        {
            console.log("Error creating folder: " + err);
            return null;
        }
    }
}


async function deleteTeamFolder (status, folder) 
{
    
    try { 
        const rimraf = require('rmfr'); 

        if (status != "Success") {
            console.log("Error - team data not saved yet");
            return;
        }

        await rimraf(folder);
        console.log("Deleted team folder without errors.");
    }

    catch (error) {
        if (error.code == 'EEXIST') {
            console.log("Team Directory doesn't exist."); 
        }
        else {
            console.log("Error deleting folder: " + error);
        }
    }

}


async function saveRentalTeamInfo (data) {

    try {
        const mongoose = require('mongoose'); 
		const Team = mongoose.model('teams'); 

        const rentalTeamData = data;

        const existingTeam = await Team.findOne({ rentalCode: rentalTeamData.rentalCode });

        if (existingTeam && existingTeam != undefined) {
			throw "This team has already been added!";
        }
        else {
            await new Team({ 
                teamId: rentalTeamData.id,
                ign: rentalTeamData.ign,
                rentalCode: rentalTeamData.rentalCode,
                pokemon: rentalTeamData.pokemon
            }).save();  

            console.log("Rental Team data has been saved.");
        }

        return "Success";
    }

    catch (error) {
        console.log("Error writing Teams data file");
        console.log(error);
        return "Failed"; 
    }
}


async function adjustContrast (imagePath, outputFolder) 
{
    try {
        const jimp = require('jimp');
        const outputPath = outputFolder + "/team.jpg";
    
        const image = await jimp.read (imagePath);
        await image.contrast(0.4);
        const testImage = await image.writeAsync(outputPath);
        console.log("Saved image with high contrast");
        return await outputPath;
    }

    catch (error) {
        console.log ("Error creating new image with high contrast.");
        console.log(error);
    }

}



async function extractImages(rentalTeamScreenshot, teamFolder) 
{
    try { 
        const sharp = require('sharp');
        const bucketUrl = 'https://' + keys.S3BucketName + '.s3.amazonaws.com/';

        const adjustedImage = await adjustContrast(rentalTeamScreenshot, teamFolder); 
        const teamImage = sharp(adjustedImage);

        await teamImage.extract({ left: 350, top: 585, width: 190, height: 40 })
        .toFile(teamFolder + "/ign.jpg", function (err){ 
            console.log("Saved IGN Image!");
        });

        await teamImage.extract({ left: 545, top: 630, width: 395, height: 45 })
        .toFile(teamFolder + "/rentalcode.jpg", function (err) { 
            console.log("Saved Rental Code Image!");
        });


        //pokemon 01 
        await teamImage.extract({ left: 80, top: 85, width: 260, height: 110 })
        .toFile(teamFolder + "/pokemon_01_info.jpg", function (err) { 
            console.log("Saved Pokemon 01 Info Image!");
        });

        await teamImage.extract({ left: 240, top: 20, width: 100, height: 70 })
        .toFile(teamFolder + "/pokemon_01_type.jpg", function (err) { 
            console.log("Saved Pokemon 01 Type Image!");
        });

        await teamImage.extract({ left: 395, top: 20, width: 220, height: 175 })
        .toFile(teamFolder + "/pokemon_01_moves.jpg", function (err) { 
            console.log("Saved Pokemon 01 Moves Image!");
        });

        //Pokemon 02
        await teamImage.extract({ left: 80, top: 275, width: 260, height: 110 })
        .toFile(teamFolder + "/pokemon_02_info.jpg", (err) => { 
            console.log("Saved Pokemon 02 Info Image!");
        });

        const pokemon_02_type = teamFolder + "/pokemon_02_type.jpg";
        await teamImage.extract({ left: 240, top: 200, width: 100, height: 70 })
        .toFile(teamFolder + "/pokemon_02_type.jpg", function (err) { 
            console.log("Saved Pokemon 02 Type Image!");
        });

        await teamImage.extract({ left: 395, top: 205, width: 220, height: 175 })
        .toFile(teamFolder + "/pokemon_02_moves.jpg", function (err) { 
            console.log("Saved Pokemon 02 Moves Image!");
        });
        
        //Pokemon 03
        await teamImage.extract({ left: 80, top: 465, width: 260, height: 110 })
        .toFile(teamFolder + "/pokemon_03_info.jpg", () => { 
            console.log("Saved Pokemon 03 Info Image!");
        });

        await teamImage.extract({ left: 240, top: 395, width: 100, height: 70 })
        .toFile(teamFolder + "/pokemon_03_type.jpg", function (err) { 
            console.log("Saved Pokemon 03 Type Image!");
        });

        await teamImage.extract({ left: 395, top: 395, width: 230, height: 175 })
        .toFile(teamFolder + "/pokemon_03_moves.jpg", function (err) { 
            console.log("Saved Pokemon 03 Moves Image!");
        });

        //Pokemon 04
        await teamImage.extract({ left: 665, top: 85, width: 260, height: 110 })
        .toFile(teamFolder + "/pokemon_04_info.jpg", function (err) { 
            console.log("Saved Pokemon 04 Info Image!");
        });

        const pokemon_04_type = teamFolder + "/pokemon_04_type.jpg";
        const teamImage_pokemon_04_type = await teamImage.extract({ left: 820, top: 20, width: 100, height: 70 })
        .toFile(pokemon_04_type, function (err) { 
            console.log("Saved Pokemon 04 Type Image!")
    });

        const pokemon_04_moves = teamFolder + "/pokemon_04_moves.jpg";
        const teamImage_pokemon_04_moves = await teamImage.extract({ left: 980, top: 20, width: 220, height: 175 })
        .toFile(pokemon_04_moves, function (err) { 
            console.log("Saved Pokemon 04 Moves Image!");
        });

        //Pokemon 05

        const pokemon_05_info = teamFolder + "/pokemon_05_info.jpg";
        await teamImage.extract({ left: 665, top: 275, width: 260, height: 110 })
        .toFile(pokemon_05_info, function (err) { 
            console.log("Saved Pokemon 05 Info Image!");
        });

        const pokemon_05_type = teamFolder + "/pokemon_05_type.jpg";
        await teamImage.extract({ left: 820, top: 200, width: 100, height: 70 })
        .toFile(pokemon_05_type, function (err) { 
            console.log("Saved Pokemon 05 Type Image!");
        });

        const pokemon_05_moves = teamFolder + "/pokemon_05_moves.jpg";
        await teamImage.extract({ left: 980, top: 205, width: 220, height: 175 })
        .toFile(pokemon_05_moves, function (err) { 
            console.log("Saved Pokemon 05 Moves Image!");
        });


        //Pokemon 06

        const pokemon_06_info = teamFolder + "/pokemon_06_info.jpg";
        const teamImage_pokemon_06_info = await teamImage.extract({ left: 665, top: 465, width: 260, height: 110 })
        .toFile(pokemon_06_info, function (err) { 
            console.log("Saved Pokemon 06 Info Image!");
        });

        const pokemon_06_type = teamFolder + "/pokemon_06_type.jpg";
        const teamImage_pokemon_06_type = await teamImage.extract({ left: 820, top: 395, width: 100, height: 70 })
        .toFile(pokemon_06_type, function (err) { 
            console.log("Saved Pokemon 06 Type Image!");
        });

        const pokemon_06_moves = teamFolder + "/pokemon_06_moves.jpg";
        const teamImage_pokemon_06_moves = await teamImage.extract({ left: 980, top: 395, width: 220, height: 175 })
        .toFile(pokemon_06_moves, function (err) { 
            console.log("Saved Pokemon 06 Moves Image!");
        });
        
    }

    catch (error) { 
        console.log("Error extracting images: " + error);
    }

}


function getIgnData (results) {

    if (results == null){
        console.log ("ERROR - No detections from IGN image.");
        return; 
    }

    const detections = results[0].textAnnotations[0].description;
    return detections.replace(/(\r\n|\n|\r)/gm, "");
}


function getRentalCodeData (results) {

    if (results == null){
        console.log ("ERROR - No detections from Team ID image.");
        return; 
    }

    const detections = results[0].textAnnotations;

	let teamID = detections[0].description.replace(/(\r\n|\n|\r)/gm, "");
	teamID.replace(/\s/g, '');
    
    return teamID;
}



function getPokemonTypeData (pokemonData, results) {

    if (results == null)
    {
        console.log ("ERROR - No detections from Pokemon Type image.");
        return; 
    }

    detections = results[0].textAnnotations;
    pokemonData.type1 = detections[1].description.replace(/(\r\n|\n|\r)/gm, "");

    if ( detections[2] != null )
    {
        pokemonData.type2 = detections[2].description.replace(/(\r\n|\n|\r)/gm, "");
    }
    
    return pokemonData; 
}



function getPokemonInfoData (pokemonData, results) {

    if (results == null){
        console.log ("ERROR - No detections from Pokemon " + number + " info image.");
        return; 
    }

    detections = results[0].textAnnotations;

    let pokemonInfo = detections[0].description.split("\n",3);
    let nameLvlInfo = pokemonInfo[0].split(" ");

    let level = nameLvlInfo.pop();
    nameLvlInfo.pop();
    
    const isGender = nameLvlInfo.pop();

    if (isGender.length < 2) 
        pokemonData.name = nameLvlInfo.toString();
    else {
        nameLvlInfo.push(isGender);
        pokemonData.name = nameLvlInfo.toString();
    }

    pokemonData.level = level; 
    pokemonData.ability = pokemonInfo[1];
    pokemonData.item = pokemonInfo[2];

    return pokemonData; 
}



function getPokemonMovesData (pokemonData, results) {

    if (results == null){
        console.log ("ERROR - No detections from Pokemon " + number + " Moves image.");
        return; 
    }

    detections = results[0].textAnnotations;
    pokemonData.moveset = [];
    pokemonData.moveset = detections[0].description.split("\n",4);

    return pokemonData;
}




async function getVisionData (id, teamFolder)
{
    try {
        let rentalTeamInfo = {}; 
        rentalTeamInfo.id = id;

        const resultsIGN = await client.textDetection(teamFolder + "/ign.jpg");
        rentalTeamInfo.ign = await getIgnData(resultsIGN);
        console.log(rentalTeamInfo.ign);
    
        const resultsRentalCode = await client.textDetection(teamFolder + "/rentalcode.jpg");
        rentalTeamInfo.rentalCode = await getRentalCodeData(resultsRentalCode); 
        console.log(rentalTeamInfo.rentalCode);

        rentalTeamInfo.pokemon = []; 

        let pokemonData = {};

        const resultsPkmn01info = await client.textDetection(teamFolder + "/pokemon_01_info.jpg");
        pokemonData = getPokemonInfoData(pokemonData, resultsPkmn01info);

        const resultsPkmn01type = await client.textDetection(teamFolder + "/pokemon_01_type.jpg");
        pokemonData = getPokemonTypeData(pokemonData, resultsPkmn01type);

        const resultsPkmn01moves = await client.textDetection(teamFolder + "/pokemon_01_moves.jpg")
        pokemonData = getPokemonMovesData(pokemonData, resultsPkmn01moves);

        rentalTeamInfo.pokemon.push(pokemonData);

        pokemonData = {};
        const resultsPkmn02info = await client.textDetection(teamFolder + "/pokemon_02_info.jpg");
        pokemonData = getPokemonInfoData(pokemonData, resultsPkmn02info);

        const resultsPkmn02type = await client.textDetection(teamFolder + "/pokemon_02_type.jpg");
        pokemonData = getPokemonTypeData(pokemonData, resultsPkmn02type);

        const resultsPkmn02moves = await client.textDetection(teamFolder + "/pokemon_02_moves.jpg")
        pokemonData = getPokemonMovesData(pokemonData, resultsPkmn02moves);

        rentalTeamInfo.pokemon.push(pokemonData);

        pokemonData = {};
        const resultsPkmn03info = await client.textDetection(teamFolder + "/pokemon_03_info.jpg");
        pokemonData = getPokemonInfoData(pokemonData, resultsPkmn03info);

        const resultsPkmn03type = await client.textDetection(teamFolder + "/pokemon_03_type.jpg");
        pokemonData = getPokemonTypeData(pokemonData, resultsPkmn03type);

        const resultsPkmn03moves = await client.textDetection(teamFolder + "/pokemon_03_moves.jpg")
        pokemonData = getPokemonMovesData(pokemonData, resultsPkmn03moves);

        rentalTeamInfo.pokemon.push(pokemonData);


        pokemonData = {};
        const resultsPkmn04info = await client.textDetection(teamFolder + "/pokemon_04_info.jpg");
        pokemonData = getPokemonInfoData(pokemonData, resultsPkmn04info);

        const resultsPkmn04type = await client.textDetection(teamFolder + "/pokemon_04_type.jpg");
        pokemonData = getPokemonTypeData(pokemonData, resultsPkmn04type);

        const resultsPkmn04moves = await client.textDetection(teamFolder + "/pokemon_04_moves.jpg")
        pokemonData = getPokemonMovesData(pokemonData, resultsPkmn04moves);

        rentalTeamInfo.pokemon.push(pokemonData);


        pokemonData = {};
        const resultsPkmn05info = await client.textDetection(teamFolder + "/pokemon_05_info.jpg");
        pokemonData = getPokemonInfoData(pokemonData, resultsPkmn05info);

        const resultsPkmn05type = await client.textDetection(teamFolder + "/pokemon_05_type.jpg");
        pokemonData = getPokemonTypeData(pokemonData, resultsPkmn05type);

        const resultsPkmn05moves = await client.textDetection(teamFolder + "/pokemon_05_moves.jpg")
        pokemonData = getPokemonMovesData(pokemonData, resultsPkmn05moves);

        rentalTeamInfo.pokemon.push(pokemonData);


        pokemonData = {};
        const resultsPkmn06info = await client.textDetection(teamFolder + "/pokemon_06_info.jpg");
        pokemonData = getPokemonInfoData(pokemonData, resultsPkmn06info);

        const resultsPkmn06type = await client.textDetection(teamFolder + "/pokemon_06_type.jpg");
        pokemonData = getPokemonTypeData(pokemonData, resultsPkmn06type);

        const resultsPkmn06moves = await client.textDetection(teamFolder + "/pokemon_06_moves.jpg")
        pokemonData = getPokemonMovesData(pokemonData, resultsPkmn06moves);

        rentalTeamInfo.pokemon.push(pokemonData);

        return rentalTeamInfo; 

    }

    catch (error){ 
        console.log("Error while processing Google Vision information.");
        console.log(error);
    }
}


async function createRentalTeam (rentalTeamScreenshot, teamId)
{
	const teamFolder = await createTeamFolder(teamId); 
    await extractImages(rentalTeamScreenshot, teamFolder); 

	const rentalTeamData = await getVisionData(teamId, teamFolder);
	console.log("Rental team data created", rentalTeamData);
    const status = await saveRentalTeamInfo(rentalTeamData);
	await deleteTeamFolder(status, teamFolder);

    return rentalTeamData;
}

async function fetchTeamsData() {
	const mongoose = require('mongoose'); 
	const Team = mongoose.model('teams'); 

	const teams = await Team.find({}); 
	return teams;
}

async function fetchTeamByIgn(ign) {
	const mongoose = require('mongoose'); 
	const Team = mongoose.model('teams'); 

	const team = await Team.findOne({ ign: ign });
	if (team) {
		console.log(team);
		return await team; 
	}
	else return "No teams found";
}


async function fetchTeamById(id) {
	const mongoose = require('mongoose'); 
	const Team = mongoose.model('teams'); 

	const team = await Team.findOne({ id: id });

	if (team) {
		return await team; 
	}
}

module.exports.createNewTeamID = createNewTeamID;
module.exports.createRentalTeam = createRentalTeam;
module.exports.saveTeamToMongoDB = saveRentalTeamInfo;

module.exports.fetchTeamByIgn = fetchTeamByIgn;
module.exports.fetchTeamById = fetchTeamById;
module.exports.fetchTeamsData = fetchTeamsData;

module.exports.createTeamFolder = createTeamFolder;
module.exports.extractImages = extractImages;
module.exports.getVisionData = getVisionData;
module.exports.deleteTeamFolder = deleteTeamFolder;
