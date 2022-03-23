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

let renderTime = null;
let stoppedTime = null;
let started = null;

let timeElapsed = null;

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

//Display "waiting for other players"
const displayWaitingForPlayers = () => {
	hideElement(startEl); //släcker register-rutan
	displayElement(waitingEl); //visar "waiting for another player-ruta"
};

// Get random values for virus
const getRandomVirus = getVirusData => {
	virusEl.style.gridColumn = `${getVirusData.col} / span 1`;
	virusEl.style.gridRow = `${getVirusData.row} / span 1`;
	setTimeout(() => {
		displayElement(virusEl);
	}, getVirusData.delay);
};
// Render players on scoreboard
const updatePlayers = players => {
	document.querySelector('#playersNameList').innerHTML = players
		.map(player => `<li class="player">${player}</li>`)
		.join('');
};

/*//////
//  Socket events
/////*/

// Starting game
const startGame = getVirusData => {
	hideElement(waitingEl);
	displayElement(gameWrapperEl);
	getRandomVirus(getVirusData);
};

/*//////
//  Submit and click events
/////*/

// Register new player
usernameFormEl.addEventListener('submit', e => {
	e.preventDefault();

	username = usernameFormEl.username.value;
	displayWaitingForPlayers();

	socket.emit('player:join', username, status => {
		if (status.success) {
			console.log(`${username} has joined successfully`);
			startGame();
		}
	});
});

// Click event for virus
virusEl.addEventListener('click', () => {});

/*//////
//  Socket on events - Listening to server
/////*/

socket.on('player:connected', updatePlayers);

socket.on('game:start', startGame);
