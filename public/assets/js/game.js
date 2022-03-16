const socket = io();

/** DOM Elements **/
const startEl = document.querySelector('#start');
const gameWrapperEl = document.querySelector('#gameWrapper');
const gameAreaEl = document.querySelector('#gameArea');
const usernameFormEl = document.querySelector('#usernameForm');
const playerUsernameEl = document.querySelector('#playerUsername');
const playerScoreEl = document.querySelector('#playerScore');
const virusTextEl = document.querySelector('#virusText');
const virusEl = document.querySelector('#virus');



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


//DISPLAY VIRUS 

//1. Display virus with delay
/*
function delayVirusDisplay() {
    alert('Virus is here in your alert only for you <3 ');
  }
*/

setTimeout(() => {console.log("viruuus")}, 5000);
setTimeout(() => {setInnerText(virusTextEl, "VIRUS HERE!")}, 5000);
//setTimeout(() => {setInnerHTML(virusEl, IMAGE)}, 5000);
//virus.src = "./assets/icons/virus.png"
   
 

  

  




/*//////§
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




