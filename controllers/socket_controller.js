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
		joinGame(this, playQueue.pop()); // player 1 & player 2
		return;
	}

	playQueue.push(this); //this = spelaren

	this.emit('player:waiting'); //
};

const joinGame = (player1, player2) => {
	const roomId = `${player1.id}#${player2.id}`;

	// players är i samma rum
	player1.join(roomId);
	player2.join(roomId);

	activeGames[roomId] = {
		players: [{ ...player1.playerData }, { ...player2.playerData }],
		gameRound: 1,
	};

	// start new game
	startGame(player1, player2, roomId);
};

const startGame = (player1, player2, roomId) => {
	player1.emit('game:start', {
		id: player1.id,
		opponent: player2.playerData.username,
	});

	player2.emit('game:start', {
		id: player2.id,
		opponent: player1.playerData.username,
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