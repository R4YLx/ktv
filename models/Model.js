/*/////
//  Modules
/////*/


//get room id
const roomId = (rooms, id) => {
    return rooms.find(room => room.id === id);
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