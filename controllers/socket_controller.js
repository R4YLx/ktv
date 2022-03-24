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
handleConnect = function (username) { // username är parameter som vi skickar från game.js
	this.playerData = { // this = klienten
		id: this.id, // = klientId
		player: username,
		score: 0,
		reactionTime: null,
	};

	// find another player
	if (playQueue.length) {
		joinGame(player, playQueue.pop());
		return;
	}
	
	playQueue.push(this); //this = spelaren

	this.emit('player:waiting');

};



const joinGame = (player1, player2) => {
	const gameId = `${player1.id}#${player2.id}`;

	player1.join(gameId);
	player2.join(gameId);

	activeGames[gameId] = {
		players: [{ ...player1.playerData }, { ...player2.playerData }],
		gameRound: 1,
	};

	// start new game
	startGame(player1, player2, gameId);
};

const startGame = (player1, player2, gameId) => {
	player1.emit('game:start', {
		id: player1.id,
		opponent: player2.playerData.username,
	});

	player2.emit('game:start', {
		id: player2.id,
		opponent: player1.playerData.username,
	});

	// emit delay and random virus
	io.in(gameId).emit('virus:show', getVirusData());
};


module.exports = function (socket, _io) {
	io = _io;
	debug('On start of app: a new client has connected', socket.id);

	/**
	 * Socket on events - Listening to client
	 */

	socket.on('player:connected', handleConnect);
};
