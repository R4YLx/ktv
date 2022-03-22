/**
 * Socket Controller
 */

const debug = require('debug')('ktv:socket_controller');
let io = null; //sätter io till null för att kunna lägga in player-objects här i sen när de connectat?

let rooms = 1; //antal rum från början. när mer än 2 spelare vill spela ska de sen hamna i rum nr 2 osv.
let gamesArray = []; //sätter en tom array för att sedan fylla med spel, där info om spelare och vilket rum de är i ska ligga. (vi fyller på med mer info sen)

let players = {}; //players är ett tomt objekt. vi lägger spelare här i, de som är i samma rum ligger i samma players-objekt

/**
 *
 * Functions
 */

const virusData = () => {
	let col = Math.floor(Math.random() * 21);
	let row = Math.floor(Math.random() * 21);
	let delay = Math.floor(Math.random() * 5000);

	return (getVirusData = {
		col,
		row,
		delay,
	});
};

// Start game handler (denna ska ändras helt klart och utvecklas men ligger som en liten boilerplate här så länge)
const handleStartGame = () => {
	// emit delay and random virus
	debug('Someone clicked on the virus');

	// Gets random virus position and delay on each click
	// this.emit('game:start', getVirus);

	// setTimeout(() => {
	// 	this.emit('virus:position', getRandomPosition(), getRandomPosition());
	// }, getRandomDelay());
};

// Handle connecting players
const handlePlayerJoined = function (username, callback) {
	players[this.id] = username; //sets the players id to be equal to their username instead. Utan denna rad så connectar de bara till ett rum och if-satsen på rad 74 körs ej

	this.join(rooms);

	if (Object.keys(players).length === 2) {
		callback({
			success: true,
			//usersThatareOnline: Object.values(players), //hämtar ut innehållet i objektet players från usersthatareonline. men det behöver vi inte veta här
		});

		const room = rooms;

		// add the room players are in and which 2 players that are in the room, to the games array
		let thisGame = {
			room,
			players,
		};

		debug(thisGame.players, room);

		const player1 = players[this.id];
		delete players[this.id];
		const player2 = Object.values(players);

		gamesArray.push(thisGame); //pushes thisGame into the from start empty Games-array

		//io.emit('start game');
		io.in(room).emit('game:start', player1, player2, virusData());

		// empty players
		players = {};

		// when 2 people are in a room, a new room has to be crfeated for a 3rd player to join, and so on.
		rooms++;

		//startGame(); //kallar på display, set position och delay som vi kan lägga inom en funktion (rad 29)

		//kalla på rad 144 if sucess true function i game
	}
};

// Handle disconnecting players
const handleDisconnect = function () {
	debug(`Client with socket id ${this.id} disconnected :(`);

	// let everyone connected know that player has disconnected
	this.broadcast.emit('player:disconnected', players[this.id]);

	// remove user from list of connected players
	delete players[this.id];
};

// Handle when virus is clicked
const handleVirusClick = function () {
	debug('Someone clicked on the virus');

	// Gets random virus position and delay on each click
	// this.emit('virus:position', getVirus);
	this.emit('game:newRound', virusData);
	// setTimeout(() => {
	// 	this.emit('virus:position', getRandomPosition(), getRandomPosition());
	// }, getRandomDelay());
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

	//handle START
	socket.on('virus:start', handleStartGame);

	// handle player connect
	socket.on('player:join', handlePlayerJoined);

	// handle player disconnect
	socket.on('disconnect', handleDisconnect);

	// handle click on virus
	socket.on('virus:clicked', handleVirusClick);

	// handle reaction time
	socket.on('reaction-time', handleReactionTime);
};
