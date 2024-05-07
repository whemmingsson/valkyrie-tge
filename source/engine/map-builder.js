const Room = require('../core/models/room.js');
const Map = require('../core/models/map.js');
const mapBuilder = {};

mapBuilder.build = function (roomDefintions) {
    const map = new Map();
    const rooms = roomDefintions.map(roomDefintion => new Room(roomDefintion));
    rooms.forEach(room => map.addRoom(room));
    rooms.forEach(room => {
        const roomDef = room.getRoomDefinition();
        const exits = roomDef.exits;

        // Add adjacent rooms
        exits.forEach(roomExit => {
            const direction = roomExit.direction;
            const roomId = roomExit.room_id;
            const adjacentRoom = map.getRoomById(roomId);
            if (!adjacentRoom) throw new Error(`Cannot create adjacent room. Room with id ${roomId} not found.`);
            room.addAdjacentRoom(direction, adjacentRoom);
        });
    });

    return map;
}

module.exports = mapBuilder;