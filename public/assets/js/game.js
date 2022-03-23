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

const getRandomVirus = virusData => {
	virusEl.style.gridColumn = `${virusData.col} / span 1`;
	virusEl.style.gridRow = `${virusData.row} / span 1`;
	setTimeout(() => {
		displayElement(virusEl);
		startTime = Date.now();
	}, virusData.delay);
};

/*//////
//  Events
/////*/

// Register new player
usernameFormEl.addEventListener('submit', e => {
	e.preventDefault();
});

// Click event for virus
virusEl.addEventListener('click', () => {});

/*//////
//  Socket events
/////*/
