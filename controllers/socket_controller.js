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

const getVirusData = () => {
	let col = Math.floor(Math.random() * 21);
	let row = Math.floor(Math.random() * 21);
	let delay = Math.floor(Math.random() * 5000);

	return (getVirusData = {
		col,
		row,
		delay,
	});
};

const findAnotherPlayer = player => {
	if (playQueue.length) {
		joinGame(player, playQueue.pop());
		return;
	}

	playQueue.push(player);

	player.emit('player:waiting');
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

/*//////
//  Handling events
/////*/

handleConnect = function (username) {
	this.playerData = {
		id: this.id,
		player: username,
		score: 0,
		reactionTime: null,
	};

	findAnotherPlayer(this);
};

module.exports = function (socket, _io) {
	io = _io;
	debug('On start of app: a new client has connected', socket.id);

	/**
	 * Socket on events - Listening to client
	 */

	socket.on('player:connected', handleConnect);
};
