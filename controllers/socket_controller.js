/**
 * Socket Controller
 */

const debug = require('debug')('ktv:socket_controller');
let io = null; //sätter io till null för att kunna lägga in player-objects här i sen när de connectat?

let rooms = 1; //antal rum från början. när mer än 2 spelare vill spela ska de sen hamna i rum nr 2 osv.
let gamesArray = []; //sätter en tom array för att sedan fylla med spel, där info om spelare och vilket rum de är i ska ligga. (vi fyller på med mer info sen)

let players = {}; //players är ett tomt objekt. vi lägger spelare här i, de som är i samma rum ligger i samma players-objekt

let count = 0;
let rounds = 0;
const maxRounds = 10;

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

const getRoomById = id => {
	return gamesArray.find(room => room.id === id);
};

/**
 *
 * Handling events
 *
 */

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

		const room_id = this.id;

		// add the room players are in and which 2 players that are in the room, to the games array
		let thisGame = {
			id: room_id,
			room,
			players,
		};

		debug(thisGame.players, room);

		//pushes thisGame into the from start empty Games-array
		gamesArray.push(thisGame);

		debug('ROOOOM ID', gamesArray[0].id);

		//io.emit('start game');
		io.in(room).emit('game:start', players, virusData());

		// empty players
		players = {};

		// when 2 people are in a room, a new room has to be crfeated for a 3rd player to join, and so on.
		rooms++;
	}
};

// Handle when virus is clicked
const handleVirusClick = function (playerData) {
	debug('Someone clicked on the virus');

	debug('HAJSAN NY GREJ', gamesArray);

	debug('Player 1 aka first player to join clicked info', playerData);

	// let playersInGame = gamesArray.filter(x => x.id === this.id);

	const gamework = gamesArray.filter(x => {
		return (x = this.id);
	});

	debug('help us lord', gamework);

	// debug('synTAX ERROR????', playersInGame);
	count++;
	let winner;

	if (count % 2 !== 0) {
		// give points to the fastest player (the first one that clicked is the first one in to the server)
		playersInGame[playerData.id];
		rounds++;

		debug('how many playersInGame are here?', playersInGame);

		debug('giving point if this works. Otherwise broken.');
	}
	// } else {
	// 	// const randomVirus = virusData();

	// 	if (rounds < maxRounds) {
	// 		debug('random virus should appear if  this works');

	// 		debug('length should be 2:', Object.keys(playersInGame).length);
	// 		// emit new game round
	// 		io.emit('game:newRound', playersInGame, virusData());
	// 		// } else if (rounds === maxRounds) {
	// 		// 	// check who the winner is
	// 		// 	Object.values(players).map(player => {
	// 		// 		if (player.score > 5) {
	// 		// 			winner = player.name;
	// 		// 			return winner;
	// 		// 		}
	// 		// 	});
	// 		// 	// emit 'end-game'-event when 10 rounds has been played and let the clients know who is the winner
	// 		// 	io.emit('end-game', players, winner);
	// 		// 	delete players[this.id];
	// 		// 	// reset game
	// 		// 	rounds = 0;
	// 		// 	players = {};
	// 	}
	// }
};

// Handle disconnecting players
const handleDisconnect = function () {
	debug(`Client with socket id ${this.id} disconnected :(`);

	// let everyone connected know that player has disconnected
	this.broadcast.emit('player:disconnected', players[this.id]);

	// remove user from list of connected players
	delete players[this.id];
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

	// handle click on virus
	socket.on('virus:clicked', handleVirusClick);

	// handle player disconnect
	socket.on('disconnect', handleDisconnect);

	// handle reaction time
	socket.on('reaction-time', handleReactionTime);
};
