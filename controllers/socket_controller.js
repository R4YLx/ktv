/**
 * Socket Controller
 */

const debug = require('debug')('ktv:socket_controller');
let io = null;

const players = {};
const lobby = {};

const getRandomPosition = () => {
	return Math.floor(Math.random() * 21);
};

const getRandomDelay = () => {
	return Math.floor(Math.random() * 5000);
};

const getVirus = () => {
	let col = Math.floor(Math.random() * 21);
	let row = Math.floor(Math.random() * 21);
	let delay = Math.floor(Math.random() * 5000);

	this.emit('virus:get', col, row, delay);
};

// Handle connecting players
const handlePlayerJoined = function (username, callback) {
	debug(`User ${username} with socket id ${this.id} has joined ${lobby}.`);
	players[this.id] = username;

	this.join(lobby);

	this.emit('player:connected', username);

	callback({ success: true });
};

// Handle disconnecting players
const handleDisconnect = function () {
	debug(`Client ${this.id} disconnected :(`);

	// let everyone connected know that player has disconnected
	this.broadcast.emit('player:disconnected', players[this.id]);

	// remove user from list of connected players
	delete players[this.id];
};

// Check if two players are online

// Match 1 vs 1 players

// Start game
const startGame = () => {
	// emit delay and random virus
};

// Handle when virus is clicked
const handleClick = function () {
	debug('Someone clicked on the virus');

	// Gets random virus position and delay on each click

	// this.emit('virus:position', getVirus);
	setTimeout(() => {
		this.emit('virus:position', getRandomPosition(), getRandomPosition());
	}, getRandomDelay());
};

// Compare reaction time and update score
const handleReactionTime = function () {};

// Decide winner

// Start new game.
// 1. Display virus
// 2. Update score
// 3.

// Update scoreboard.

module.exports = function (socket, _io) {
	io = _io;

	debug('On start of app: a new client has connected', socket.id);

	// handle player connect
	socket.on('player:join', handlePlayerJoined);

	// handle player disconnect
	socket.on('disconnect', handleDisconnect);

	// handle click on virus
	socket.on('virus:click', handleClick);
};
