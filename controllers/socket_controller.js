/**
 * Socket Controller
 */

const debug = require('debug')('ktv:socket_controller');
let io = null;

// get functions from models
const { roomId, playerId, opponentId,score, winner } = require('../models/Model');

const rooms = {};
const thisGame = {};

const players = {};
const lobby = {};

//testing
let opponent = {};
let timesClicked = 0;
let activeGame = {
    playersInGame: {},
    playedRounds: 0,
    score: {},
    reactionTime: {}
};
let scoreboard = {}; 


 //ev. sätt in dessa i start new game function
const getRandomPosition = () => {
	return Math.floor(Math.random() * 21);
};
	
const getRandomDelay = () => {
	return Math.floor(Math.random() * 5000);
};
	
const getVirus = () => {
	let col = getRandomPosition;
	let row = getRandomPosition;
	let delay = getRandomDelay;

	this.emit('virus:get', col, row, delay);
};
 
// Handle connecting players
const handlePlayerJoined = function (username, callback) {
	debug(`User ${username} with socket id ${this.id} has connected.`);
	players[this.id] = username; //sets name to be their id
 
	//this.join(lobby);
	//this.emit('player:connected', username);
 
	callback({ 
		success: true,
		onlineUsers: Object.values(players), //hämtar ut innehållet i objektet players. Här ser vi hur många players
	}); //

	if (Object.keys(players).length === 2) {
        game.playersInGame[this.id] = players[this.id];
        game.score[this.id] = 0;
        scoreboard[game.playersInGame[this.id]] = 0;

        io.emit('update-scoreboard with new players', scoreboard, game.playedRounds);
        io.emit('start game');

        startGame(); //kallar på display, set position och delay som vi kan lägga inom en funktion (rad 29)
    } else if (Object.keys(users).length < 2) {
        //kalla på rad 144 if sucess true function i game
    } 
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

	// handle player disconnect
	socket.on('disconnect', handleDisconnect);

	// handle click on virus
	socket.on('virus:click', handleClick);

	// handle reaction time
	socket.on('reaction-time', handleReactionTime);
};