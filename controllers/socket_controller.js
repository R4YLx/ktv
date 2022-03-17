/**
 * Socket Controller
 */

const debug = require('debug')('ktv:socket_controller'); //läser in debug
let io = null;

const users = {};
// const waitingRoom = {
// 	id: 'waitingRoom',
// 	users: { name: username, time: timestamp },
// };

const gameRounds = 10;

const getPlayer1 = null;
const getPlayer2 = null;

const matchPlayers = () => {};

// Create a function for handling joined user
const handleUserJoined = function (username, room_id, callback) {
	debug(
		`User ${username} with socket id ${this.id} wants to join room '${room_id}'`
	);
};

// // Handle user disconnect
// socket.on('disconnect', function() {
// debug(`Player ${this.id} disconnected`);

// //broadcast to everyone else that the user disconnected (vi kan annars strunta i att broadcasta detta och bara skicka ut felmeddelande till den andra spelaren/alternativt att spelet bara avbryts och den får ett "du-vann-meddelande!" bara )
// this.broadcast.emit('user:disconnected');
// });

// Randomize virus position and send location to game.js to display

module.exports = function (socket, _io) {
	debug('A new client has connected', socket.id);

	// Handle user joined
	socket.on('user:joined', handleUserJoined);
};