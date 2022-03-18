/**
 * Socket Controller
 */

const debug = require('debug')('ktv:socket_controller');
let io = null;

let players = {};
let availableRoom = 1;
let games = [];

const getVirus = () => {};

// Function for handling connecting players
const handlePlayerJoined = function (username, callback) {
	debug(`User ${username} with socket id ${this.id} has joined.`);

	players[this.id] = username;

	callback({ success: true });
};

module.exports = function (socket) {
	io = this;

	debug('On start of app: a new client has connected', socket.id);

	// handle player connect
	socket.on('playerJoined', handlePlayerJoined);
};
