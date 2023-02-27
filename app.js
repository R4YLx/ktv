const express = require("express");
const cors = require("cors");
const logger = require("morgan");

// instantiate express
const app = express();

// middlewares
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// serve static files from public folder
//finns ingen route som matchar på 3000 så kommer den kolla i public-mappen om det finns en fil som matchar
app.use(express.static("public"));

module.exports = app;
