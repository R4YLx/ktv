/*//////
//  DOM Elements
/////*/
const playerOneNameEl = document.querySelector('#playerOneName');
const playerTwoNameEl = document.querySelector('#playerTwoName');

const gameWrapperEl = document.querySelector('#gameWrapper');

const startEl = document.querySelector('#start');

const usernameFormEl = document.querySelector('#usernameForm');

const virusEl = document.querySelector('#virus');

const waitingEl = document.querySelector('#waiting');

/*//////
//  Variables
/////*/

const socket = io();
let username = null;
let playerId = null;

let reactionTime;
let startTime;
let timerInterval;
let virusTimeout;

/*//////
//  Functions 
/////*/

/*//////
//  Events
/////*/

//* display virus

//*
// Register new player
usernameFormEl.addEventListener('submit', e => {
	e.preventDefault();

	username = usernameFormEl.username.value;

	socket.emit('player:connected', username);
});

//Display "waiting for other players"
const displayWaitingForPlayer = () => {
	waitingEl.classList.remove('hide');
	startEl.classList.add('hide');
};

// Starting game
const startGame = ({ id, opponent }) => {
	console.log('show id:', id);
	console.log('show opponent', opponent);

	playerId = id;

	// place players names
	playerOneNameEl.innerText = username;
	playerTwoNameEl.innerText = opponent;

	// dölj spinner
	waitingEl.classList.add('hide');
	startEl.classList.add('hide');

	// visa spelet
	gameWrapperEl.classList.remove('hide');
};

// Render players on scoreboard
const updatePlayers = () => {};

// Setting new location and delay after click
const updateVirus = getVirusData => {};

const updateScore = id => {};

// Get random values for virus
const getRandomVirus = () => {};
/*//////
//  Submit and click events
/////*/

// Click event for virus
virusEl.addEventListener('click', () => {});

/*//////
//  Socket on events - Listening to server
/////*/

socket.on('player:waiting', displayWaitingForPlayer); // visa spinnner

socket.on('game:start', startGame);
