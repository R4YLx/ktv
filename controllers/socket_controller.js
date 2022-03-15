/**
 * Socket Controller
 */

const debug = require('debug')('ktv:socket_controller'); //läser in debug

module.exports = function(socket) { //det finns en socket till varje ny anslutning av en person till spelet
	  debug('a new client has connected', socket.id);

    socket.emit('Welcome to the pixel game', 'WELCOME TO THE PIXEL GAME!');

    
    // Create a function for handling joined user
    const handleUserJoined = function () {};

    // Put available players into one gameroom
    const assignUserToRoom = function () {};


    // Handle user disconnect
	  socket.on('disconnect', function() {
		debug(`Player ${this.id} disconnected`);

      //broadcast to everyone else that the user disconnected (vi kan annars strunta i att broadcasta detta och bara skicka ut felmeddelande till den andra spelaren/alternativt att spelet bara avbryts och den får ett "du-vann-meddelande!" bara )
      this.broadcast.emit('user:disconnected');
    }); 





}



// 6. Randomize virusPosition


// 7. Randomize DelayVirusDisplay - SET TIMEOUT, slumpar en delay-tid innan Virus-position sätts ut

//<h2 id="VirusHere"></h2> //put in html
//put in JS chat and not here (?????)
  /*
  const myTimeout = setTimeout(delayVirusDisplay, 5000); //sets the timer to 5 seconds

  function delayVirusDisplay() {
    document.getElementById("VirusHere").innerHTML = "Virus comes after you now after 5 seconds!"
  }
  */
  //vi kan annars göra en onclick på viruset: <button onclick="setTimeout(delayVirusDisplay, 3000);">Click this virus!</button>
