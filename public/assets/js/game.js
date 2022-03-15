const socket = io();

const startEl = document.querySelector('#start');
const gameWrapperEl = document.querySelector('#gameWrapper');
const gameAreaEl = document.querySelector('#gameArea');
const usernameFormEl = document.querySelector('#usernameForm');

let username = null;

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
			startEl.classList.add('hide');

			// show game area
			gameWrapperEl.classList.remove('hide');
		}
	});
});

<<<<<<< Updated upstream
// testing branch
// I want to merge
=======
// Click event for virus
gameAreaEl.addEventListener('click', e => {
	console.log(e.target.tag);

	// if (e.target.id.contains('gameArea')) {
	// 	console.log('miss');
	// } else {
	// 	console.log('hit');
	// }
});

/*
//showing virus after 5 seconds in alert-message to test function
function delayVirusDisplay() {
    alert('Virus is here in your alert only for you <3 ');
  }
*/
>>>>>>> Stashed changes
