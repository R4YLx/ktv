/*/////
//  Modules
/////*/


// get game room id with players id
const roomId = (thisGame, playerId) => {
    const thisRoomId = Object.keys(thisGame);
    return thisRoomId.find(thisRoomId => thisRoomId.includes === playerId);
};


// get player by room id
const playerId = (id, rooms, roomId) => {
    return rooms[roomId].players.find (player => player.id === id);
};


// get opponent id
const opponentId = (id, rooms, roomId) => {
    return rooms[roomId].players.find (player => player.id === id);
};


// check reaction time and give points
const score = (player, opponent) => {
    if (player.elapsedTime < opponent.elapsedTime) {
        player.score++;

    }   else {
        opponent.score++;
    }
};


// get result (winner)
const winner = (player, opponent) => {
    if (player.score < opponent.score) {
        return opponent;
    }   else {
        return player; //! hur visa för vinnaren. hur ska det se ut?
    }
};


module.exports = {
    roomId,
    playerId,
    opponentId,
    score,
    winner,
};