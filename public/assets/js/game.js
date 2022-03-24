/*//////
//  DOM Elements
/////*/

const gameWrapperEl = document.querySelector('#gameWrapper');

const playerOneNameEl = document.querySelector('#playerOneName');
const playerTwoNameEl = document.querySelector('#playerTwoName');

const playerOneTimeEl = document.querySelector('#playerOneTime');
const playerTwoTimeEl = document.querySelector('#playerTwoTime');

const currentRoundEl = document.querySelector('#currentRound');

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

const timer = element => {
	document.querySelector(element).innerHTML = (elapsedTime / 1000).toFixed(3); //(3)- is nr of decimals
};

// start timer when virus is on display
let startTimer = () => {
	let startTime = Date.now();
	interval = setInterval(function () {
		elapsedTime = Date.now() - startTime;
		timer('#playerOneTime', elapsedTime);
	}, 100);
};

// Opponents reaction time
const opponentTimer = () => {
	timer('#playerTwoTime', time);
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

const displayVirus = ({ col, row, delay }) => {
	virusTimeout = setTimeout(() => {
		// update virus position
		virusEl.style.gridColumn = `${col} / span 1`;
		virusEl.style.gridRow = `${row} / span 1`;
		virusEl.classList.remove('hide');

		// start timer
		// startTimer();
	}, delay);
};

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

socket.on('virus:show', displayVirus);
