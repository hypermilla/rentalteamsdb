const express = require("express"); 
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');

const keys = require("./config/keys");
const routes = require("./routes.js");
require("./models/Team"); 

mongoose.connect(keys.mongoURI);

const app = express();
app.use('/', routes);
app.use(express.static(path.join(__dirname, 'client/build')));

const PORT = keys.port; 
app.listen(PORT, () => {
    console.log("Server is running on port" + PORT);
});