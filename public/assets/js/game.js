const socket = io();

/** DOM Elements **/
const startEl = document.querySelector('#start');
const gameWrapperEl = document.querySelector('#gameWrapper');
const gameAreaEl = document.querySelector('#gameArea');
const usernameFormEl = document.querySelector('#usernameForm');
const playerUsernameEl = document.querySelector('#playerUsername');
const playerScoreEl = document.querySelector('#playerScore');
const opponentScoreEl = document.querySelector('#playerScore');
const playAgainButtonEl = document.querySelector('#playAgainButton');
const scoreboardEl = document.querySelector('#scoreboard');
const currentRoundEl = document.querySelector('#currentRound');
const showRoundsEl = document.querySelector('#showRounds');
const messageEl = document.querySelector('#message');

let username = null;
let score = 0;
let virus = '';
//let showRounds = 0;
let currentRound = 0;
let continueGame = true;
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

const setInnerHTML = (element, value) => {
	element.innerHTML = value;
};

const getRandomNumber = value => {
	return Math.floor(Math.random() * value) + 1;
};

// Get time and calculate
let interval;
let startTime;
let elapsedTime;
let stopTime;
let playerTime; 
let sum = 0;



// Start timer when virus is on display
let startTimer = () => {
	startTime = Date.now();
	interval = setInterval(function() {
		let elapsedTime = Date.now() - startTime;
		
		document.querySelector("#playerOneTime").innerHTML = (elapsedTime / 1000).toFixed(3);//(3)- is nr of decimals
	}, 	100);

}

// Stop timer
let stopTimer = () => {
	stopTime = Date.now();
	clearInterval(interval);
	saveTime();
	console.log(timeSum)
};


let saveTime = () => {
	const time = stopTime - startTime
	playerTime = time/1000
	timeSum.push (playerTime)

	timeSum.forEach (time => {
		if (showVirus === 10) {
			sum += time/10;
			document.querySelector("#playerOneTime").innerHTML  = `<span>${time}</span>`
		}
	});	
};


//Creates numbers between 1-26 and let´s that number be equal to the grid-position of the same div-box. 
const getGrid = () => {
	for (let i = 1; i < 27; i++) {
		let gridbox = document.createElement('div');
		gridbox.id = i;
		gridbox.className = 'gridbox' + i + ' ' + 'gridbox' + ' ' + 'img-fluid';
		// gridbox.src = '';
		gameAreaEl.appendChild(gridbox);
	}
};
getGrid();



//randomizes the grid-positions between 1-26. Puts the virus-image in that grid-div-box.
const randomizedVirusPosition = () => {

    let gridPosition = Math.floor(Math.random() * 26) + 1;
    let position = document.getElementById(gridPosition);
    let virus = document.createElement('img');

    virus.id = 'virus';
    virus.src = './assets/icons/virus.png';
    position.appendChild(virus);
};

//DISPLAY VIRUS WITH RANDOM DELAY
const showVirus = () => {
	setTimeout(() => {
		randomizedVirusPosition(); //calls the display-virus-function
			
		startTimer();
			
		//window.alert('Done waiting');
	}, Math.floor(Math.random() * 5000)); //slumpar ut viruset mellan 0 och 5 sekunder		 
};

//add startTimer to showVirus-function
showVirus();


//  Events
/////*/

gameAreaEl.addEventListener('click', e => {
	if (e.target.tagName === 'IMG' ) {
		//prevents default page reload
		e.preventDefault();
		score++; //Players score is updated


		console.log('You killed the virus!');
		setInnerText(playerScoreEl, score);
		setInnerText(currentRoundEl, score);
		stopTimer();

	}

    //sets game to equal 10 rounds
    if(score == 10){
		messageEl.innerHTML = `<p>CONGRATULATIONS YOU WON!</p> 
            <button type="playAgainButton">Play again</button>
                ` 
		score=0;
		stopTimer();

    }

	//Play again event

if(e.target.getAttribute("type") === "playAgainButton"){

	continueGame = false;
	
	score = 0;
	
	setInnerText(playerScoreEl, score);
	setInnerText(currentRoundEl, score);
	
	currentRoundEl.innerHTML = 0;
	
	//currentRoundEl.innerHTML = ""; //nollställer Scoreboard
	
	//showRoundsEl.innerHTML = ""; //nollställer Scoreboard
	
	//playerScoreEl.innerHTML= ""; //nolställer Spelare 1:s poäng
	
	//opponentScoreEl.innerHTML=""; //nolställer Spelare 2:s poäng
	
	messageEl.innerHTML = ""; //nollställer "Grattis-meddelandet"
	
	}

});

// Submit event for username
usernameFormEl.addEventListener('submit', e => {
	e.preventDefault();

	username = usernameFormEl.username.value;

	// emit 'user:joined' event and when we get acknowledgement, THEN show chat
	socket.emit('playerJoined', username, status => {
		if (status.success) {
			hideElement(startEl);
			setInnerText(playerUsernameEl, username);
			displayElement(gameWrapperEl);
		}
	});
});

// listen for when a user disconnects
socket.on('user:disconnected', username => {
	addNoticeToChat(`${username} disconnected 😢`);
});

// listen for when we're disconnected
socket.on('disconnect', reason => {
	console.log(`Disconnected because of ${reason}} 😳`);
});