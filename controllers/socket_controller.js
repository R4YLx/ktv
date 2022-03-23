/**
 * Socket Controller
 */

/*//////
//  Variables
/////*/

const debug = require('debug')('ktv:socket_controller');
let io = null;

let player = null;

let players = {};

let gamesArray = [];

let rooms = 1;

let playerReady = 0;

let clickedVirus = 0;

let rounds = 0;

let playAgain = 0;

/*//////
//  Functions 
/////*/

// Get usernames of online users
const getOnlinePlayers = function () {
	return gamesArray.map(player => player.username);
};

// const getRandomDelay = function () {
// 	return Math.floor(Math.random() * 5000);
// };

// const getRandomPositionX = function () {
// 	return Math.floor(Math.random() * 21);
// };

// const getRandomPositionY = function () {
// 	return Math.floor(Math.random() * 21);
// };

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

/*//////
//  Handling events
/////*/

const handleJoin = function (username, callback) {
	// Create player profile
	player = {
		socketId: this.id,
		username,
		reactionTime: [],
		score: 0,
	};

	// adding new player to array with other players
	gamesArray.push(player);

	debug('Show player data', player);

	if (gamesArray.length === 2) {
		callback({
			success: true,
			connectedPlayers: getOnlinePlayers(),
		});

		io.emit('player:connected', getOnlinePlayers());

		io.emit('game:start', virusData());

		gamesArray = [];
	}
};

module.exports = function (socket, _io) {
	io = _io;
	debug('On start of app: a new client has connected', socket.id);

	/**
	 * Socket on events - Listening to client
	 */

	socket.on('player:join', handleJoin);
};
