const context = require('./game-context').ctx;

const objectFinder = {};

objectFinder.find = (targetName) => {
    const room = context.map.getRoomById(context.currentRoom.id);

    // So the targetName is a type of object. We need to find it in the current room + current direction.
    // First, check the room's items
    const item = room.items.find((item) => item.name === targetName);
    if (item) {
        return item;
    }

    // Check the rooms doors in the current direction
    if (targetName === "door") {
        const doors = room.doors.filter((door) => door.direction.toUpperCase() === context.playerDirection);
        if (doors) {
            return doors[0];
        }
        else {
            // Here we have multiple doors in the same direction. We need to ask the player which one they mean.
            // Maybe construct a new type of action?
        }
    }
}




module.exports = objectFinder;