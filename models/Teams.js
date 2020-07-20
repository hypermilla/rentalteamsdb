const mongoose = require ('mongoose');
const Schema = mongoose.Schema; 
// const { Schema } = mongoose; 

const teamSchema = new Schema({
    "teamId": String,
    "ign": String,
    "rentalCode": String,
    "pokemon": [
        {
            "name": String,
            "level": String,
            "ability": String,
            "item": String,
            "type1": String,
            "type2": String,
            "moveset": [
                String,
                String,
                String,
                String,
            ]
        }
    ]
});

mongoose.model('teams', teamSchema);