/**
 * Socket Controller
 */

const debug = require('debug')('ktv:socket_controller');
let io = null;
/**
 *
 * Functions
 */

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

/**
 *
 * Handling events
 *
 */

const handleConnect = function (username) {};

module.exports = function (socket, _io) {
	io = _io;

	debug('On start of app: a new client has connected', socket.id);
};
