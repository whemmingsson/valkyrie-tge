const Room = require('../core/models/room.js');
const Door = require('../core/models/door.js');
const Map = require('../core/models/map.js');
const C = require('../core/constants');
const crypto = require('crypto');
const Container = require('../core/models/container.js');
const mapBuilder = {};

mapBuilder.build = function (roomDefintions) {
    const map = new Map();
    const rooms = roomDefintions.map(roomDefintion => new Room(roomDefintion));
    rooms.forEach(room => map.addRoom(room));
    rooms.forEach(room => {
        const roomDef = room.getRoomDefinition();

        // Add adjacent rooms/doors
        (roomDef.doors ?? []).forEach(door => {
            const direction = door.direction;
            const roomId = door.roomid;
            const adjacentRoom = map.getRoomById(roomId);
            if (!adjacentRoom) throw new Error(`Cannot create adjacent room. Room with id ${roomId} not found.`);
            room.addAdjacentRoom(direction, adjacentRoom);

            const doorObj = new Door(crypto.randomUUID(), door.open ?? false, door.locked ?? false, direction, door.name);
            map.doors.push(doorObj);
            room.addDoor(doorObj);
        });

        // Add items
        (roomDef.items ?? []).filter(item => C.itemTypes.includes(item.type)).forEach(item => {
            if (item.type == C.ITEM_TYPE_CONTAINER) {
                room.addItem(new Container(item));
            }
        });
    });

    return map;
}

module.exports = mapBuilder;