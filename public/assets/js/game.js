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
const playerOnetimeEl = document.querySelector('#playerOnetime');
const playerTwotimeEl = document.querySelector('#playerTwotime');


/*//////
//  Variables
/////*/

const socket = io();
let room = null;
let username = null;
let username2 = null;
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
		opponentTimer();
		setInnerText(playerOnetimeEl, player1);
		setInnerText(playerTwotimeEl, player2);

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


const getRandomVirus = virusData => {
	virusEl.style.gridColumn = `${virusData.col} / span 1`;
	virusEl.style.gridRow = `${virusData.row} / span 1`;
	setTimeout(() => {
		displayElement(virusEl);
		startTimer();
	}, virusData.delay);
};

// Update scoreboard. Get score from server

//Display "waiting for other players"
const displayWaitingForPlayers = () => {
	hideElement(startEl); //släcker register-rutan
	displayElement(waitingEl); //visar "waiting for another player-ruta"
};

const startGame = (player1, player2, virusData) => {
	setInnerText(playerUsernameEl, player1);
	setInnerText(opponentUsernameEl, player2);
	hideElement(waitingEl);
	displayElement(gameWrapperEl);
	getRandomVirus(virusData); //visar viruset
};

//denna måste vara här för att viruset ska visas
const newRound = (player1, player2, virusData) => {
	virusImg.style.display = 'none';
	displayElement(virusEl);
	

	// DESSA FUNKTIONER ÄR EJ KLARA
	// if (Object.keys(players).length === 2) {
	// 	getRandomVirus(virusData);

	// 	updateScoreBoard(player1, player2);
	// }
};

/*//////
//  Events
/////*/

// Register new player
usernameFormEl.addEventListener('submit', e => {
	e.preventDefault();

	username = usernameFormEl.username.value;
	displayWaitingForPlayers();

	socket.emit('player:join', username, status => {
		if (status.success) {
			startGame();
		}
	});
});

// Click event for virus
virusEl.addEventListener('click', () => {
	//prevents default page reload
	//e.preventDefault();
	stopTimer();
	//clearInterval(interval);

		// hide virus 
		//virusEl.src = '';
		hideElement(virusEl);



	//score++;
	//setInnerText(currentRoundEl, score);
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
});

	// socket.emit('virus:clicked'), playerData;




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
	}
});

// Restart game on disconnect






	


/*//////
//  Socket events
/////*/

socket.on('opponentTimer', opponentTimer);

socket.on('game:start', startGame);

socket.on('waitingForPlayer', displayWaitingForPlayers);

socket.on('newRound', newRound);



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