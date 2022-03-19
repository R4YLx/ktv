/**
 * Socket Controller
 */

const debug = require('debug')('ktv:socket_controller');
let io = null;

let players = {};

const getRandomPosition = () => {
	return Math.floor(Math.random() * 21);
};

const getRandomDelay = () => {
	return Math.floor(Math.random() * 5000);
};

// Handle connecting players
const handlePlayerJoined = function (username, callback) {
	debug(`User ${username} with socket id ${this.id} has joined.`);
	players[this.id] = username;

	this.emit('player:connected', username);

	callback({ success: true });
};

// Handle disconnecting players

// Check if two players are online

// Match 1 vs 1 players

// Handle when virus is clicked
const handleClick = function () {
	debug('Someone clicked on the virus');

	// Gets random virus position and delay on each click
	setTimeout(() => {
		this.emit('virus:position', getRandomPosition(), getRandomPosition());
	}, getRandomDelay());
};

// Compare reaction time and update score

// Decide winner

// Start new game.

// Update scoreboard.

module.exports = function (socket, _io) {
	io = _io;

	debug('On start of app: a new client has connected', socket.id);

	// handle player connect
	socket.on('playerJoined', handlePlayerJoined);

	socket.on('virus:click', handleClick);
};
