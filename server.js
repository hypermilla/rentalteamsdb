//General dependencies
const path = require('path');
const keys = require("./config/keys");

//MongoDB
const mongoose = require("mongoose");
mongoose.connect(keys.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
require("./models/Teams");

//Express
const express = require('express'); 
const router = require("./routes.js");

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.urlencoded());
app.use(express.json());
app.use('/', router);


const PORT = keys.port; 
app.listen(PORT, () => {
    console.log("Server is running on port" + PORT);
});