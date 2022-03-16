const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const mongose = require("mongoose"); //läser in mongose för att kunna connecta till  databasen. (ta npm install mongoose)

// instantiate express
const app = express();
 
//Connect to mongoDB
//const dbURI = 'mongodb+srv://Kill The Virus.mongodb.net' //et string from MongoDB database when connecting to it in mongo DB Atlas
/*
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true}  ) //connect to Kill The Virus. Lägger i options-object för att slippa "deprication"-varning
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));
    //console.log('connected to the database');
    */

// middlewares
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// serve static files from public folder
//finns ingen route som matchar på 3000 så kommer den kolla i public-mappen om det finns en fil som matchar
app.use(express.static("public"));

module.exports = app;
