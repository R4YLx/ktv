/**
 * Socket Controller
 */

const debug = require('debug')('ktv:socket_controller'); //läser in debug

// Socket.io server instance
let io = null;

// List of users
const users = {};

//List of rooms
const rooms = [{}];

// Create a function for handling joined user
const handleUserJoined = function (username, room_id, callback) {
	debug(
		`User ${username} with socket id ${this.id} wants to join room '${room_id}'`
	);

	// Join room
	this.join(room_id);

	// Find room
	const room = rooms.find(gameroom => gameroom.id === room_id);

	// Add socket to room's users-object
	// room.users[this.id] = username;
};

// Put available players into one gameroom
const assignUserToRoom = function () {
	socket.emit('Welcome to the pixel game', 'WELCOME TO THE PIXEL GAME!');
};

// // Handle user disconnect
// socket.on('disconnect', function() {
// debug(`Player ${this.id} disconnected`);

// //broadcast to everyone else that the user disconnected (vi kan annars strunta i att broadcasta detta och bara skicka ut felmeddelande till den andra spelaren/alternativt att spelet bara avbryts och den får ett "du-vann-meddelande!" bara )
// this.broadcast.emit('user:disconnected');
// });

//det finns en socket till varje ny anslutning av en person till spelet
module.exports = function (socket, _io) {
	debug('A new client has connected', socket.id);

	// Handle user joined
	socket.on('user:joined', handleUserJoined);
};

// 6. Randomize virusPosition

// 7. Randomize DelayVirusDisplay - SET TIMEOUT, slumpar en delay-tid innan Virus-position sätts ut


