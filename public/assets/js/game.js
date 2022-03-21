/*//////
//  DOM Elements
/////*/
const currentRoundEl = document.querySelector('#currentRound');
const exitGameButtonEl = document.querySelector('#exitGameButton');
const gameAreaEl = document.querySelector('#gameArea');
const gameWrapperEl = document.querySelector('#gameWrapper');
const messageEl = document.querySelector('#message');
const noticeEl = document.querySelector('#notice');
const opponentUsernameEl = document.querySelector('#opponentUsername');
const playAgainButtonEl = document.querySelector('#playAgainButton');
const playerScoreEl = document.querySelector('#playerScore');
const playerUsernameEl = document.querySelector('#playerUsername');
const showRoundsEl = document.querySelector('#showRounds');
const startEl = document.querySelector('#start');
const usernameFormEl = document.querySelector('#usernameForm');
const virusEl = document.querySelector('#virus');
const waitingEl = document.querySelector('#waiting');

/*//////
//  Variables
/////*/

const socket = io();

let username = null;
let score = 0;
let currentRound = 0;
let continueGame = true;

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

// shows and hides notice element
const showLightbox = () => {
	if (noticeEl.style.display === 'grid') {
		noticeEl.style.display = 'none';
		hideElement(noticeEl);
	} else {
		noticeEl.style.display = 'grid';
		displayElement(noticeEl);
	}
};

const timer = element => {
	document.querySelector(element).innerHTML = (elapsedTime / 1000).toFixed(3); //(3)- is nr of decimals
};

//! OK. rör ej
// start timer when virus is on display
let startTimer = () => {
	let startTime = Date.now();
	interval = setInterval(function () {
		elapsedTime = Date.now() - startTime;
		timer('#playerOneTime', elapsedTime);
	}, 100);
};
//! OK ???
// Opponents reaction time
const opponentTimer = () => {
	timer('#playerTwoTime', elapsedTime);
};

// Stop timer
let stopTimer = () => {
	stopTime = Date.now();
	clearInterval(interval);
};

// // THIS SHOULD MOVE TO SERVER SIDE!
// let saveTime = () => {
// 	if (showVirus === 10) {
// 		stopTimer();
// 		const time = stopTime - startTime;
// 		playerTime = time / 1000;
// 		timeSum.push(playerTime);
// 	}

// 	timeSum.forEach(time => {
// 		if (showVirus === 10) {
// 			sum += time / 10;
// 			document.querySelector(
// 				'#playerOneTime'
// 			).innerHTML = `<span>${time}</span>`;
// 		}
// 	});
// };

const setVirus = (col, row, delay) => {
	virusEl.style.gridColumn = `${col} / span 1`;
	virusEl.style.gridRow = `${row} / span 1`;
	setTimeout(() => {
		displayElement(virusEl);
		startTimer();
	}, delay);
};

// Update scoreboard. Get score from server

//Display "waiting for other players"
const displayWaitingForPlayers = () => {
	hideElement(startEl); //släcker register-rutan
	displayElement(waitingEl); //visar "waiting for another player-ruta"
};

const startGame = (player1, player2) => {
	setInnerText(playerUsernameEl, player1);
	setInnerText(opponentUsernameEl, player2);
	hideElement(waitingEl);
	displayElement(gameAreaEl);
};

/*//////
//  Events
/////*/

// Register new player
usernameFormEl.addEventListener('submit', e => {
	e.preventDefault();

	username = usernameFormEl.username.value;

	socket.emit('player:join', username, status => {
		if (status.success) {
			/*	//gör om till funktion "waitingn for other players"
			hideElement(startEl); //släcker register-rutan
			displayElement(waitingEl); //visar "waiting for another player-ruta"
			setInnerText(playerUsernameEl, username);
			displayElement(gameWrapperEl);
			*/
			// displayWaitingForPlayers();
			// startGame();
			// setVirus();
		}
	});
});

// Play again when game over
playAgainButtonEl.addEventListener('click', e => {
	if (e.target.getAttribute('type') === 'playAgainButton') {
		score = 0;
		setInnerText(playerScoreEl, score);
		setInnerText(currentRoundEl, score);
		currentRoundEl.innerHTML = 0;
		//currentRoundEl.innerHTML = ""; //nollställer Scoreboard
		//playerScoreEl.innerHTML= ""; //nolställer Spelare 1:s poäng
		//opponentScoreEl.innerHTML=""; //nolställer Spelare 2:s poäng
		messageEl.innerHTML = ''; //nollställer "Grattis-meddelandet"
	}
	//Exit game-event
	if (e.target.getAttribute('type') === 'exitGameButton') {
		hideElement(gameWrapperEl);
		messageEl.innerHTML = `
		<p>YOU LOST!, ${username}</p> 
		`;
		//messageEl.innerHTML = ''; //nollställer "Grattis-meddelandet"
	}
});

// Restart game on disconnect

// Click event for virus
virusEl.addEventListener('click', () => {
	score++;
	socket.emit('virus:click');
	stopTimer();

	setInnerText(currentRoundEl, score);
	hideElement(virusEl);

	//sets game to equal 10 rounds
	if (score === 4) {
		showLightbox();

		// This function doesn't work...
		hideElement(virusEl);
		startTimer();

		setInnerText(messageEl, 'CONGRATULATIONS YOU WON!');
		setInnerText(playAgainButtonEl, 'Play Again');
		setInnerText(exitGameButtonEl, 'Exit');
	}

	/*
	//logik för förloraren (funkar inte med else här men nåt liknande):
	else {
		messageEl.innerHTML = 
		`
			<p>YOU LOST!, ${username}</p> 
			<button type="playAgainButton">Play again</button>
			<button type="">Exit</button>
				` 
			score=0;
	}
	*/
});

/*//////
//  Socket events
/////*/

socket.on('opponentTimer', opponentTimer);

socket.on('virus:position', setVirus);

socket.on('virus:get', setVirus);

socket.on('newGame', startGame);

socket.on('waitingForPlayer', displayWaitingForPlayers);
