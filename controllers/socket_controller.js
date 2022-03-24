/**
 * Socket Controller
 */

/*//////
//  Variables
/////*/

const debug = require('debug')('ktv:socket_controller');
let io = null;

const activeGames = {};
const playQueue = [];
const maxGameRounds = 10;

/*//////
//  Functions 
/////*/

/*//////
//  Handling events
/////*/

// Här ihop med register new flayer från game.js
handleConnect = function (username) {
	// username är parameter som vi skickar från game.js
	this.playerData = {
		// this = klienten
		id: this.id, // = klientId
		player: username,
		score: 0,
		reactionTime: null,
	};

	// find another player
	if (playQueue.length) {
		const playerOne = this;
		const playerTwo = playQueue.pop();

		const roomId = `${playerOne.id}#${playerTwo.id}`;

		debug('playerOne', playerOne.id);
		debug('playerTwo', playerTwo.id);

		// players är i samma rum
		playerOne.join(roomId);
		playerTwo.join(roomId);

		activeGames[roomId] = {
			players: [{ ...playerOne.playerData }, { ...playerTwo.playerData }],
			gameRound: 1,
		};

		// start new game
		startGame(playerOne, playerTwo, roomId);
		return;
	}

	playQueue.push(this); //this = spelaren

	this.emit('player:waiting'); //
};

const startGame = (playerOne, playerTwo, roomId) => {
	playerOne.emit('game:start', {
		id: playerOne.id,
		opponent: playerTwo.playerData.player,
	});

	playerTwo.emit('game:start', {
		id: playerTwo.id,
		opponent: playerOne.playerData.player,
	});

	// emit delay and random virus
	//io.in(roomId).emit('virus:show', getVirusData());
};

module.exports = function (socket, _io) {
	io = _io;
	debug('On start of app: a new client has connected', socket.id);

	/**
	 * Socket on events - Listening to client
	 */

	socket.on('player:connected', handleConnect);
};
