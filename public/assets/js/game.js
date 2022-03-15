const socket = io();

const startEl = document.querySelector('#start');
const gameWrapperEl = document.querySelector('#gameWrapper');
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

// testing branch
// I want to merge
