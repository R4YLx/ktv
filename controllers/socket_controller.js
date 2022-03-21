/**
 * Socket Controller
 */

const debug = require('debug')('ktv:socket_controller');
let io = null;

// get functions from models
const { roomId, playerId, opponentId,score, winner } = require('./functions');

const thisRoom = {};
let rooms = 1
let gamesArray = []

let players = {};
 
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


// Check if two players are online
 
// Match 1 vs 1 players
 
// // Start game
// const startGame = () => {
// 	// emit delay and random virus
// };
 
// Handle when virus is clicked
const handleClick = function () {
	debug('Someone clicked on the virus');
 
	// Gets random virus position and delay on each click
 
	// this.emit('virus:position', getVirus);
	setTimeout(() => {
		this.emit('virus:position', getRandomPosition(), getRandomPosition());
	}, getRandomDelay());
};

// Compare reaction time and update score //! inte klar
const handleReactionTime = function (reactionTime) {
	// get current room id
	const roomId = roomId(this.id, rooms, thisGame);

	// save reaction time (playerId from Model)
	const player = playerId(this.id, roomId, thisGame);
	player.elapsedTime = reactionTime;

	//emit
};
 

 
module.exports = function (socket, _io) {
	io = _io;

	debug('On start of app: a new client has connected', socket.id);

	// handle player connect
	socket.on('player:join', handlePlayerJoined);

	socket.on('player', startGame);

	// handle player disconnect
	socket.on('disconnect', handleDisconnect);

	// handle click on virus
	socket.on('virus:click', handleClick);

	// handle reaction time
	socket.on('reaction-time', handleReactionTime);
};