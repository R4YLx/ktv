/*//////
//  DOM Elements
/////*/
const currentRoundEl = document.querySelector('#currentRound');
const exitGameButtonEl = document.querySelector('#exitGameButton');
const gameAreaEl = document.querySelector('#gameArea');
const gameWrapperEl = document.querySelector('#gameWrapper');
const messageEl = document.querySelector('#message');
const noticeEl = document.querySelector('#notice');
const playersTimer = document.querySelector('#playersTimer');
const playAgainButtonEl = document.querySelector('#playAgainButton');
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

// Get time and calculate
let interval;
let startTime;
let reactionTime;
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
	document.querySelector(element).innerHTML = (reactionTime / 1000).toFixed(3); //(3)- is nr of decimals
};

//! OK. rör ej
// start timer when virus is on display
// let startTimer = () => {
// 	let startTime = Date.now();
// 	interval = setInterval(function () {
// 		reactionTime = Date.now() - startTime;
// 		timer('#playerOneTime', reactionTime);
// 	}, 100);
// };

const startPlayerOneTimer = () => {
	let startTime = Date.now();
	interval = setInterval(function () {
		reactionTime = Date.now() - startTime;
		timer('#playerOneTime', reactionTime);
	}, 100);
};

const startPlayerTwoTimer = () => {
	let startTime = Date.now();
	interval = setInterval(function () {
		reactionTime = Date.now() - startTime;
		timer('#playerTwoTime', reactionTime);
	}, 100);
};

// Stop timer
let stopTimer = () => {
	stopTime = Date.now();
	clearInterval(interval);
};

let stopPlayersTimer = function (id) {
	if (id == socket.id) {
		clearInterval(startPlayerOneTimer);
	} else if (id !== socket.id) {
		clearInterval(startPlayerTwoTimer);
	}
};

const getRandomVirus = virusData => {
	virusEl.style.gridColumn = `${virusData.col} / span 1`;
	virusEl.style.gridRow = `${virusData.row} / span 1`;
	setTimeout(() => {
		displayElement(virusEl);
		// startPlayerOneTimer();
		// startPlayerTwoTimer();
	}, virusData.delay);
};

//Display "waiting for other players"
const displayWaitingForPlayers = () => {
	hideElement(startEl); //släcker register-rutan
	displayElement(waitingEl); //visar "waiting for another player-ruta"
};

const startGame = (players, virusData) => {
	document.querySelector('#players').innerHTML = Object.values(players)
		.map(
			player =>
				`<h3 class="playerScore">${player.name}<span>:</span><span class="score">${player.score}</span><span>:</span><span class="time">${player.time}</span></h3>`
		)
		.join(' ');

	hideElement(waitingEl);
	displayElement(gameWrapperEl);
	getRandomVirus(virusData);
};

const killedVirus = () => {};

const newRound = randomVirus => {
	// getRandomVirus(randomVirus);

	if (Object.keys(players).length === 2) {
		getRandomVirus(randomVirus);
	}
};

// Update scoreboard. Get score from server
const updateScoreBoard = players => {
	showRoundsEl.innerText = `${players[0].rounds}/10`;
	players.forEach(player => {
		playersTimer.innerHTML += `<p>${player.reactionTime}</p>`;
	});

	document.querySelector('#players').innerHTML = Object.values(players)
		.map(
			player =>
				`<h3>${player.name}<span>:</span> <span class="score">${player.score}</span></h3>`
		)
		.join(' vs ');
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
	hideElement(virusEl);

	const playerData = {
		name: socket.id,
		time: reactionTime,
		score,
	};
	console.log(playerData);

	socket.emit('virus:clicked'), playerData;
});

// Play again when game over
playAgainButtonEl.addEventListener('click', e => {
	if (e.target.getAttribute('type') === 'playAgainButton') {
		score = 0;
		setInnerText(playerScoreEl, score);
		setInnerText(currentRoundEl, score);
		currentRoundEl.innerHTML = 0;
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

/*//////
//  Socket events
/////*/

socket.on('game:start', startGame);

socket.on('game:newRound', newRound);

socket.on('game:stopTimer', stopTimer);

socket.on('player:updateScore', updateScoreBoard);
