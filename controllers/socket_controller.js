/**
 * Socket Controller
 */

/*//////
//  Variables
/////*/

const debug = require('debug')('ktv:socket_controller');
let io = null;

const activeGames = {};
const waitingRoom = [];

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

const getUpdatedScore = (playerOne, playerTwo) => {
	if (playerOne.elapsedTime < playerTwo.elapsedTime) {
		playerOne.score++;
		return { winnerId: playerOne.id, score: playerOne.score };
	} else {
		playerTwo.score++;
		return { winnerId: playerTwo.id, score: playerTwo.score };
	}
};

const getWinner = (playerOne, playerTwo) => {
	if (playerOne.score < playerTwo.score) {
		return playerTwo;
	} else if (playerTwo.score < playerOne.score) {
		return playerOne;
	}

	return null;
};

/*//////
//  Handling events
/////*/

// Hör ihop med register new player från game.js
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
		'This is a player object of connected player outside of the queue' +
			this.playerData.id
);

	// find another player
	if (waitingRoom.length) {
		joinRoom(this, waitingRoom.pop());
		return;
	}
	waitingRoom.push(this); //this = spelaren

	this.emit('player:waiting');
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

const handleClick = function (elapsedTime) {
	const roomId = getRoomId(this.id, activeGames);

	// Get player one time
	const playerOne = getPlayerOne(this.id, roomId, activeGames);
	playerOne.elapsedTime = elapsedTime;

	// send other player reaction time
	this.to(roomId).emit('playerTwo:timer', elapsedTime);
	

	// Get reaction time
	const playerTwo = getPlayerTwo(this.id, roomId, activeGames);
	if (!playerTwo.elapsedTime) {
		return;
	}

	// send updated score to updateScore() in game.js
	io.in(roomId).emit('game:updateScore', getUpdatedScore(playerOne, playerTwo));

	// GAME OVER - check game rounds and send
	if (activeGames[roomId].gameRound === 10) {
		io.in(roomId).emit('game:over', getWinner(playerOne, playerTwo));

		// delete this games id
		delete activeGames[roomId];
		return;
	}
	startNewRound(roomId); ///tar emot ett rum ID för att spela igen
};

const startNewRound = roomId => {
	// reset reaction time

	getVirusData();

	activeGames[roomId].players.forEach(player => (player.elapsedTime = null));

	//update rounds
	activeGames[roomId].gameRound++;

	// emit virus, rounds & (delay)
	io.in(roomId).emit(
		'virus:show',
		getVirusData(),
		activeGames[roomId].gameRound
	);
};


function handleDisconnect() {
	debug(`Client ${this.id} disconnected.`);

	// check if player has an active game, return if null
	const roomId = getRoomId(this.id, activeGames);
	if (!roomId) return;

	// send disconnection message
	this.to(roomId).emit('player:disconnect', {
		message: 'The other player be gone!',
	});

	// delete the game
	delete activeGames[roomId];
}

module.exports = function (socket, _io) {
	io = _io;
	debug('On start of app: a new client has connected', socket.id);

	/**
	 * Socket on events - Listening to client
	 */

	socket.on('player:connected', handleConnect);

	socket.on('virus:clicked', handleClick);

	socket.on('disconnect', handleDisconnect);
};
