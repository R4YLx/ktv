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
	debug("This i a player object of connected player outside of the queue" + this.playerData.id);

	// find another player
	if (playQueue.length) { //om det finns en array med 1 st spealre i som väntar:
	debug("this is play Queue" + playQueue.length) //visar 1.= hur många som är i playQueue
		const playerOne = this; //hämtar ut this player objectet på den enda som är i kön
		const playerTwo = playQueue.pop(); //sätter player 2 till att vara id på spelare 1
		debug('playerOne', playerOne.id);
		debug('playerTwo', playerTwo.id);

		const roomId = `${playerOne.id}`;

		debug('playerOne', playerOne.id);
		debug('playerTwo', playerTwo.id);

		// players är i samma rum
		playerOne.join(roomId);
		playerTwo.join(roomId);

		debug('playerOne', playerOne.id);
		debug('playerTwo', playerTwo.id);

		activeGames[roomId] = {
			players: [{ ...playerOne.playerData }, { ...playerTwo.playerData }],
			gameRound: 1,
		};


		// start new game -skickar detta till funktionen startGame i game.js och tar in id och erstter id och oponnent med player1 och player2.
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

module.exports = function (socket, _io) {
	io = _io;
	debug('On start of app: a new client has connected', socket.id);

	/**
	 * Socket on events - Listening to client
	 */

	socket.on('player:connected', handleConnect);
};
 