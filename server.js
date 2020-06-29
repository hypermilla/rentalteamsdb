const express = require("express"); 
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const keys = require("./config/keys");
const router = require("./routes.js");

require("./models/Team"); 

mongoose.connect(keys.mongoURI);

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/', router);


const PORT = keys.port; 
app.listen(PORT, () => {
    console.log("Server is running on port" + PORT);
});