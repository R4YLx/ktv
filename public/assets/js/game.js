const socket = io();

/** DOM Elements **/
const startEl = document.querySelector('#start');
const waitingEl = document.querySelector('#waiting');
const gameWrapperEl = document.querySelector('#gameWrapper');
const gameAreaEl = document.querySelector('#gameArea');
const virusEl = document.querySelector('#virus');
const usernameFormEl = document.querySelector('#usernameForm');
const playerUsernameEl = document.querySelector('#playerUsername');
const playerScoreEl = document.querySelector('#playerScore');
const currentRoundEl = document.querySelector('#currentRound');
const showRoundsEl = document.querySelector('#showRounds');

let username = null;
let score = 0;
let showRounds = 0;
let currentRound = 0;

// Get time and calculate
let interval;
let startTime;
let elapsedTime;
let stopTime;
let playerTime;
let sum = 0;
let timeSum = [];

/*//////
//  Functions 
/////*/

// display element
const displayElement = element => {
	element.classList.remove('hide');
};

// hide element
const hideElement = element => {
	element.classList.add('hide');
};

// set innerText value
const setInnerText = (element, value) => {
	element.innerText = value;
};

// set innerHTML value
const setInnerHTML = (element, value) => {
	element.innerHTML = value;
};

// Saras Timer-function: Start timer when virus is on display
let startTimer = () => {
	let startTime = Date.now();
	interval = setInterval(function () {
		let elapsedTime = Date.now() - startTime;

		document.querySelector('#playerOneTime').innerHTML = (
			elapsedTime / 1000
		).toFixed(3); //(3)- is nr of decimals
	}, 100);
};

const setVirusPosition = (col, row) => {
	virusEl.style.gridColumn = `${col} / span 1`;
	virusEl.style.gridRow = `${row} / span 1`;

	displayElement(virusEl);
};

/*//////
//  Events
/////*/

gameAreaEl.addEventListener('click', e => {
	// Click event for virus
	if (e.target.id === 'virus') {
		score++;
		socket.emit('virus:click');
		setInnerText(playerScoreEl, score);
		setInnerText(currentRoundEl, score);
	}
});

// Submit event for username
usernameFormEl.addEventListener('submit', e => {
	e.preventDefault();

	username = usernameFormEl.username.value;

	socket.emit('playerJoined', username, status => {
		console.log('Server acknowledged that user joined', status);

		if (status.success) {
			hideElement(startEl);
			setInnerText(playerUsernameEl, username);
			displayElement(gameWrapperEl);
		} else {
			displayElement(waitingEl);
		}
	});
});

/*//////
//  Socket events
/////*/

socket.on('virus:position', setVirusPosition);
