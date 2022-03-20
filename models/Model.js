/*/////
//  Modules
/////*/


//get room id
const roomId = (id) => {
    return rooms.find(room => room.id === id)
};


// get player by room id
const playerId = (id, rooms, roomId) => {
    return rooms[roomId].players.find (player => player.id === id)
};


// Oget opponent id
const opponentId = (id, rooms, roomId) => {
    return rooms[roomId].players.find (player => player.id === id)
};




// get score
const score = () => {};





// get result (winner)
const winner = () => {};





module.exports = {
    roomId,
    playerId,
    opponentId,
    score,
    winner,
};