const Room = require('../core/models/room.js');
const Door = require('../core/models/door.js');
const Map = require('../core/models/map.js');
const crypto = require('crypto');
const mapBuilder = {};

mapBuilder.build = function (roomDefintions) {
    const map = new Map();
    const rooms = roomDefintions.map(roomDefintion => new Room(roomDefintion));
    rooms.forEach(room => map.addRoom(room));
    rooms.forEach(room => {
        const roomDef = room.getRoomDefinition();
        const doors = roomDef.doors;

        // Add adjacent rooms/doors
        doors.forEach(door => {
            const direction = door.direction;
            const roomId = door.room_id;
            const adjacentRoom = map.getRoomById(roomId);
            if (!adjacentRoom) throw new Error(`Cannot create adjacent room. Room with id ${roomId} not found.`);
            room.addAdjacentRoom(direction, adjacentRoom);

            const doorObj = new Door(crypto.randomUUID(), door.open ?? false, door.locked ?? false);
            map.doors.push(doorObj);
            room.addDoor(doorObj);
        });
    });

    return map;
}

module.exports = mapBuilder;