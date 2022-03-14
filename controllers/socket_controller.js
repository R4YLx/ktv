/**
 * Socket Controller
 */

// Create a function for handling joined user
const handleUserJoined = function () {};

// Put available players into one gameroom
const assignUserToRoom = function () {};


// 6. Randomize virusPosition


// 7. Randomize DelayVirusDisplay - SET TIMEOUT, slumpar en delay-tid innan Virus-position sätts ut

//<h2 id="VirusHere"></h2> //put in html
//put in JS chat and not here in backend (?)
const myTimeout = setTimeout(delayVirusDisplay, 5000); //sets the timer to 5 seconds

function delayVirusDisplay() {
  document.getElementById("VirusHere").innerHTML = "Virus comes after you now after 5 seconds!"
}
//vi kan annars göra en onclick på viruset: <button onclick="setTimeout(delayVirusDisplay, 3000);">Click this virus!</button>
/*<script>
function delayVirusDisplay() {
    alert('Virus is here in your alert only for you <3 ');
  }
  </script>
  */