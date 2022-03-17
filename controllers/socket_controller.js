/**
 * Socket Controller
 */

const debug = require('debug')('ktv:socket_controller');
let io = null;

let players = {};

// Function for handling connecting players
const handlePlayerJoined = function (username, callback) {
	debug(`User ${username} with socket id ${this.id} has joined.`);

	players[this.id] = username;

	callback({ success: true });
};

// Function for handling disconnecting players
const handlePlayerDisconnected = function (username) {
	debug(`Client ${username} with id: ${this.id} disconnected`);
};

module.exports = function (socket) {
	io = this;

	debug('On start of app: a new client has connected', socket.id);

	// handle player connect
	socket.on('playerJoined', handlePlayerJoined);
	// handle player disconnet
	socket.on('disconnect', handlePlayerDisconnected);
};
