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

let playerData = null;

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
	hideElement(startEl);
	displayElement(waitingEl);
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
	document.querySelector('#playersNameList').innerHTML = Object.values(players)
		.map(player => `<li class="player">${player}</li>`)
		.join('');
};

const updateVirus = getVirusData => {
	// virusEl.style.display = 'none';
	// displayElement(virusEl);
	getRandomVirus(getVirusData);
	// if (Object.keys(players).length === 2) {
	// 	getRandomVirus(getVirusData);
	// 	updateScoreBoard(players);
	// }
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
virusEl.addEventListener('click', () => {
	hideElement(virusEl);

	playerData = {
		// reactionTime,
		id: socket.id,
		// clicked: timesClicked,
		// rounds,
	};

	socket.emit('virus:clicked', playerData);
});

/*//////
//  Socket on events - Listening to server
/////*/

socket.on('player:connected', updatePlayers);

socket.on('game:start', startGame);

socket.on('virus:reset', updateVirus);
