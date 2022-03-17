const socket = io();

/** DOM Elements **/
const startEl = document.querySelector('#start');
const gameWrapperEl = document.querySelector('#gameWrapper');
const gameAreaEl = document.querySelector('#gameArea');
const usernameFormEl = document.querySelector('#usernameForm');
const playerUsernameEl = document.querySelector('#playerUsername');
const playerScoreEl = document.querySelector('#playerScore');
const virusTextEl = document.querySelector('#virusText');

let username = null;
let score = 0;

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

const setInnerHTML = (element, value) => {
	element.innerHTML = value;
};

const getRandomNumber = value => {
	return Math.floor(Math.random() * value) + 1;
};

const getGrid = () => {
	for (let i = 1; i < 27; i++) {
		let gridbox = document.createElement('img');
		gridbox.id = i;
		gridbox.className = 'gridbox' + i + ' ' + 'gridbox' + ' ' + 'img-fluid';
		gridbox.src = '';
		gameAreaEl.appendChild(gridbox);
	}
};

getGrid();

const displayVirus = () => {
	let gridPosition = Math.floor(Math.random() * 26) + 1;
	let virus = './assets/icons/virus.png';
	let position = document.getElementById(gridPosition);

	position.src = virus;

	// set delay
};

//DISPLAY VIRUS

//1. delayVirusDisplay(); = Display virus with delay
/*
function delayVirusDisplay() {
    alert('Virus is here in your alert only for you <3 ');
  }
*/

//1.1 hämta virus
//1.2. Delay();
//1.3. Position();
//  Events
/////*/

// Submit event for username
usernameFormEl.addEventListener('submit', e => {
	e.preventDefault();

	username = usernameFormEl.username.value;

	console.log(username);
	hideElement(startEl);
	setInnerText(playerUsernameEl, username);
	displayElement(gameWrapperEl);

	// emit 'user:joined' event and when we get acknowledgement, THEN show chat
	socket.emit('user:joined', username, status => {
		//  we've received acknowledgement from the server
		console.log('A new player has joined', status);

		if (status.success) {
			// hide start view
			hideElement(startEl);

			setInnerText(playerUsernameEl, username);

			// show game
			displayElement(gameWrapperEl);
		}
	});
});

// Click event for virus
gameAreaEl.addEventListener('click', e => {
	if (e.target.tagName === 'IMG') {
		console.log('You killed the virus!');
		score++;
		setInnerText(playerScoreEl, score);
	} else {
		console.log('You missed!');
		score = 0;
		setInnerText(playerScoreEl, 0);
	}
});
