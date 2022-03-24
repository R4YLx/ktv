/*//////
//  DOM Elements
/////*/

const gameWrapperEl = document.querySelector('#gameWrapper');

const playerOneNameEl = document.querySelector('#playerOneName');
const playerTwoNameEl = document.querySelector('#playerTwoName');

const playerOneTimeEl = document.querySelector('#playerOneTime');
const playerTwoTimeEl = document.querySelector('#playerTwoTime');

const playerOneScoreEl = document.querySelector('#playerOneScore');
const playerTwoScoreEl = document.querySelector('#playerTwoScore');

const currentRoundEl = document.querySelector('#currentRound');

const startEl = document.querySelector('#start');

const usernameFormEl = document.querySelector('#usernameForm');

const virusEl = document.querySelector('#virus');

const waitingEl = document.querySelector('#waiting');

const playAgainButtonEl = document.querySelector('#playAgainButton');
const exitGameButtonEl = document.querySelector('#exitGameButton');


/*//////
//  Variables
/////*/

const socket = io();
let username = null;
let playerId = null;


let elapsedTime;
let startTime;
let interval;
let virusTimeout;

/*//////
//  Functions 
/////*/
const showLightbox = () => {
	if (noticeEl.style.display === 'grid') {
		noticeEl.style.display = 'none';
		hideElement(noticeEl);
	} else {
		noticeEl.style.display = 'grid';
		displayElement(noticeEl);
	}

/*//////
//  Events
/////*/


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
const playerTwoTimer = time => {
	timer('#playerTwoTime', time);
};

const displayVirus = ({ col, row, delay }) => {
	virusTimeout = setTimeout(() => {
		// update virus position
		virusEl.style.gridColumn = `${col} / span 1`;
		virusEl.style.gridRow = `${row} / span 1`;
		virusEl.classList.remove('hide');

		// start timer for both players
		startTimer();
	}, delay);
};

// update score
const updateScore = ({ winner, score }) => {
	if (winner === playerId) {
		playerOneScoreEl.innerText = score;
	} else {
		playerTwoScoreEl.innerText = score;
	}
};
/*
const gameOver = ({ winner, score }) => {
	if (winner === playerId) {
		playerOneScoreEl.innerText = score;
	} else {
		playerTwoScoreEl.innerText = score;
	}

};
};*/

/*//////
//  Submit and click events
/////*/

// Click event for virus
virusEl.addEventListener('click', () => {
	virusEl.classList.add('hide');
	clearInterval(interval);
	//timer(playerOneTimeEl, elapsedTime);
	//timer(playerTwoTimeEl, elapsedTime);
	//sets game to equal 10 rounds

	socket.emit('virus:clicked', elapsedTime);
});

/*//////
//  Socket on events - Listening to server
/////*/

socket.on('player:waiting', displayWaitingForPlayer); // visa spinnner

socket.on('game:start', startGame);

socket.on('virus:show', displayVirus);

socket.on('playerTwo:timer', playerTwoTimer);

socket.on('game:updateScore', updateScore);//lyssna på update score

//socket.on('game:over', gameOver);//lyssna på ugame over