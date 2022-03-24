/*//////
//  DOM Elements
/////*/

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

// Display element
const displayElement = element => {
	element.classList.remove('hide');
};

// Hide element
const hideElement = element => {
	element.classList.add('hide');
};

// Set innerText value
const setInnerText = (element, value) => {
	element.innerText = value;
};

// Set innerHTML value
const setInnerHTML = (element, value) => {
	element.innerHTML = value;
};

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
};

// Starting game
const startGame = () => {};

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
