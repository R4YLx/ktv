const socket = io();

/** DOM Elements **/
const startEl = document.querySelector('#start');
const gameWrapperEl = document.querySelector('#gameWrapper');
const gameAreaEl = document.querySelector('#gameArea');
const usernameFormEl = document.querySelector('#usernameForm');
const playerScoreEl = document.querySelector('#playerScore');

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

/*//////
//  Events
/////*/

// Submit event for username
usernameForm.addEventListener('submit', e => {
	e.preventDefault();

	username = usernameForm.username.value;

	// emit 'user:joined' event and when we get acknowledgement, THEN show chat
	socket.emit('user:joined', username, room, status => {
		//  we've received acknowledgement from the server
		console.log('A new player has joined', status);

		if (status.success) {
			// hide start view
			hideElement(startEl);

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

/*
//showing virus after 5 seconds in alert-message to test function
function delayVirusDisplay() {
    alert('Virus is here in your alert only for you <3 ');
  }
*/
