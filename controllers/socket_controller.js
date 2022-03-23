/**
 * Socket Controller
 */

/*//////
//  Variables
/////*/

const debug = require('debug')('ktv:socket_controller');
let io = null;

let players = {};

let gamesArray = [];

let rooms = 1;

/*//////
//  Functions 
/////*/

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
	players[this.id] = username;

	this.join(rooms);

	if (Object.keys(players).length === 2) {
		callback({
			success: true,
		});

		const room = rooms;

		// add the room players are in and which 2 players that are in the room, to the games array
		let thisGame = {
			room,
			players,
		};

		gamesArray.push(thisGame);

		io.in(room).emit('player:connected', players);

		io.in(room).emit('game:start', virusData());

		players = {};

		rooms++;
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
