/**
 * Socket Controller
 */

 const debug = require('debug')('ktv:socket_controller');
 let io = null;//sätter io till null för att kunna lägga in player-objects här i sen när de connectat?
 
 // get functions from models
 const { roomId, playerId, opponentId,score, winner } = require('./functions');
 
 
 let rooms = 1 //antal rum från början. när mer än 2 spelare vill spela ska de sen hamna i rum nr 2 osv.
 let gamesArray = [] //sätter en tom array för att sedan fylla med spel, där info om spelare och vilket rum de är i ska ligga. (vi fyller på med mer info sen)
 
 
 let players = {}; //players är ett tomt objekt. vi lägger spelare här i, de som är i samma rum ligger i samma players-objekt
 
 
 /**
  * 
  * Functions
  */
 
  //ev. sätt in dessa i start new game function
 const getRandomPosition = () => {
	 return Math.floor(Math.random() * 21);
 };
	 
 const getRandomDelay = () => {
	 return Math.floor(Math.random() * 5000);
 };
	 
 const getVirus = () => {
	 let col = getRandomPosition;
	 let row = getRandomPosition;
	 let delay = getRandomDelay;
 
	 this.emit('virus:get', col, row, delay);
 };
 
 
 // Start game handler (denna ska ändras helt klart och utvecklas men ligger som en liten boilerplate här så länge)
 const handleStartGame = () => {
	 // emit delay and random virus
	 debug('Someone clicked on the virus');
  
	 // Gets random virus position and delay on each click
	  this.emit('virus:position', getVirus);
 
	 setTimeout(() => {
		 this.emit('virus:position', getRandomPosition());
	 }, 
	 getRandomDelay());
 };
 
 
 
 // Handle connecting players
 const handlePlayerJoined = function (username, callback) {
	 debug(`User ${username} with socket id ${this.id} has connected to the first room: room ${rooms}`);
	 players[this.id] = username; //sets the players id to be equal to their username instead. Utan denna rad så connectar de bara till ett rum och if-satsen på rad 74 körs ej

	 //player joins a room where 0 or 1 person is in. - Utan denna rad så connectar de bara till ett rum och if-satsen på rad 74 körs ej
	 this.join(rooms);
	 debug(`User ${username} with socket id ${this.id} has connected to ONE PERSON JOINED ROOM ${rooms}`);
	 this.emit('player:connected', username);
  
	 callback({ 
		 success: true,
		// usersThatareOnline: Object.values(players), //hämtar ut innehållet i objektet players från usersthatareonline. men det behöver vi inte veta här
	 
	 }); 
 
	 
	if (Object.keys(players).length === 2) {
		 const room = 'the room u joined is room: ' + rooms
		 debug(`User ${username} with socket id ${this.id} has connected 2 PEOPLE HAVE CONNECTED to room ${rooms}`);
 
		// add the room players are in and which 2 players that are in the room, to the games array
		let thisGame = {
			room,
		 	players,
		};
 
	 	gamesArray.push(thisGame); //pushes thisGame into the from start empty Games-array
 
		 
		//io.emit('start game');
		io.to(room).emit('newGame', players);
		//rooms = KULRUM;
		debug(`Players ${gamesArray.thisGame} .User ${username} with socket id ${this.id} is in room ${rooms}.`); //please write out the players here
		//const roomId = roomId(this.id, rooms, thisGame);
		 
		debug(gamesArray);
 
		// empty players
		players = {}
 
		// when 2 people are in a room, a new room has to be crfeated for a 3rd player to join, and so on.
		rooms++
 
		 //startGame(); //kallar på display, set position och delay som vi kan lägga inom en funktion (rad 29)
	} 	else {
		 //kalla på rad 144 if sucess true function i game
	} ;
};
 
 
 
 
  
 // Handle disconnecting players
 const handleDisconnect = function () {
	 debug(`Client with socket id ${this.id} disconnected :(`);
  
	 // let everyone connected know that player has disconnected
	 this.broadcast.emit('player:disconnected', players[this.id]);
  
	 // remove user from list of connected players
	 delete players[this.id];
 };
  
 
  
 
  
 // Handle when virus is clicked
 const handleClick = function () {
	 debug('Someone clicked on the virus');
  
	 // Gets random virus position and delay on each click
	  this.emit('virus:position', getVirus);
 
	 setTimeout(() => {
		 this.emit('virus:position', getRandomPosition(), getRandomPosition());
	 }, getRandomDelay());
 };
 
 // Compare reaction time and update score //! inte klar
 const handleReactionTime = function (reactionTime) {
	 // get current room id
	 const roomId = roomId(this.id, rooms, thisGame);
 
	 // save reaction time (playerId from Model)
	 const player = playerId(this.id, roomId, thisGame);
	 player.elapsedTime = reactionTime;
 
	 //emit
 };
  
 
  
 module.exports = function (socket, _io) {
	 io = _io;
 
	 debug('On start of app: a new client has connected', socket.id);
 
	 //handle START
	 socket.on('virus:start', handleStartGame);
 
	 // handle player connect
	 socket.on('player:join', handlePlayerJoined);
 
	 // handle player disconnect
	 socket.on('disconnect', handleDisconnect);
 
	 // handle click on virus
	 socket.on('virus:click', handleClick);
 
	 // handle reaction time
	 socket.on('reaction-time', handleReactionTime);
 };