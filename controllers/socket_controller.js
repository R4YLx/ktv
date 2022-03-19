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

// Function for handling connecting players
const handlePlayerJoined = function (username, callback) {
	debug(`User ${username} with socket id ${this.id} has joined.`);
	players[this.id] = username;

	this.emit('player:connected', username);

	callback({ success: true });
};

const handleClick = function (target) {
	debug('Someone clicked on the virus', target);

	setTimeout(() => {
		this.emit('virus:position', getRandomPosition(), getRandomPosition());
	}, getRandomDelay());
};

module.exports = function (socket, _io) {
	io = _io;

	debug('On start of app: a new client has connected', socket.id);

	// handle player connect
	socket.on('playerJoined', handlePlayerJoined);

	socket.on('virus:click', handleClick);
};
