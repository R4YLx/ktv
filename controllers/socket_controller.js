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

/*//////
//  Functions 
/////*/

const getRoomId = (playerId, activeGames) => {
	const roomIds = Object.keys(activeGames);
	return roomIds.find(roomId => roomId.includes(playerId));
};

const getPlayerTwo = (id, roomId, activeGames) => {
	return activeGames[roomId].players.find(player => player.id !== id);
};

const getPlayerOne = (id, roomId, activeGames) => {
	return activeGames[roomId].players.find(player => player.id === id);
};

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
		elapsedTime: null,
	};
	debug(
		'This i a player object of connected player outside of the queue' +
			this.playerData.id
	);

	// find another player

	if (playQueue.length) {
		joinRoom(this, playQueue.pop());
		return;
	}
	playQueue.push(this); //this = spelaren

	this.emit('player:waiting'); //
};

const joinRoom = (playerOne, playerTwo) => {
	const roomId = `${playerOne.id}#${playerTwo.id}`;

	// join both players
	playerOne.join(roomId);
	playerTwo.join(roomId);

	// save to active games
	activeGames[roomId] = {
		players: [{ ...playerOne.playerData }, { ...playerTwo.playerData }],
		gameRound: 1,
	};

	// start new game
	startGame(playerOne, playerTwo, roomId);
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
	io.in(roomId).emit('virus:show', getVirusData());
};

const getVirusData = () => {
	let col = Math.floor(Math.random() * 21);
	let row = Math.floor(Math.random() * 21);
	let delay = Math.floor(Math.random() * 5000);

	return (virusData = {
		col,
		row,
		delay,
	});
};

handleClick = function (elapsedTime) {
	const roomId = getRoomId(this.id, activeGames);

	// save players reaction time
	const playerOne = getPlayerOne(this.id, roomId, activeGames);
	playerOne.elapsedTime = elapsedTime;

	// emit reaction time to opponent
	this.to(roomId).emit('playerTwo:timer', elapsedTime);

	// get opponents reaction time, return if null
	const playerTwo = getPlayerTwo(this.id, roomId, activeGames);
	if (!playerTwo.elapsedTime) return;

	// emit updated score to players
	// io.in(roomId).emit('update-scoreboard', getUpdatedScore(playerOne, playerTwo));

	// // check if game is over and emit the winner
	// if (activeGames[roomId].gameRound === maxGameRounds) {
	// 	io.in(roomId).emit('game-over', getWinner(playerOne, playerTwo));

	// 	// delete the game from list of active games
	// 	delete activeGames[roomId];

	// 	return;
	// }

	// // start new game round
	// startNewGameRound(roomId);
};

module.exports = function (socket, _io) {
	io = _io;
	debug('On start of app: a new client has connected', socket.id);

	/**
	 * Socket on events - Listening to client
	 */

	socket.on('player:connected', handleConnect);

	socket.on('virus:clicked', handleClick);
};
