#!/usr/bin/env node

/**
 * Module dependencies.
 */

require('dotenv').config();

	/*Lägga till stöd för kanaler i socket.io. +npm install express ejs. allt detta för att kunna använda CHAT ROOMS/ GAME ROOMS
	//const express = require('express');
	//const app = express(); 
	//const server = require('http).Server(app); //skcikar in application servern här. //ger oss en server som kan connecta med server.io vilket gör att vi kan använda de här io-grejorna i vår kod.
	//const io = require('socket.io')(server);

	app.set('views', './views'); //create a views-folder for this path to function
	app.set('view engine', 'ejs');
	appuse(express.static('public)); //here goes all code for the javascript for the client side. in this folder
	app.use(express.urlencoded({ extended: true }));  //gör att vi kan använbda url-encoded parameters istllet för en body för en form
	*/

const app = require('../app');
const debug = require('debug')('game:server');
const http = require('http');
const socketio = require('socket.io');
const socket_controller = require('../controllers/socket_controller');


/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const io = new socketio.Server(server);

io.on('connection', socket => {
	socket_controller(socket, io);
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	debug('Listening on ' + bind);
}
