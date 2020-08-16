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

// Not serving the static html files from react client anymore
//app.use(express.static(path.join(__dirname, 'client/build')));

// Allow CORS from App Domain 
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://rotomi.io');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);
app.use(express.urlencoded());
app.use(express.json());
app.use('/', router);


const PORT = keys.port; 
app.listen(PORT, () => {
    console.log("Server is running on port" + PORT);
});