import Room from '../core/models/room.js';
import Door from '../core/models/door.js';
import Map from '../core/models/map.js';
import Key from '../core/models/key.js';
import Container from '../core/models/container.js';
import C from '../core/constants.js';
import Item from '../core/models/item.js';

// This builder is responsible for creating the map object from the game definition
// The map object is a collection of rooms, doors, and items
// The map object is used by the game runner to navigate the game world

// A decision needs to to made about if we really need this builder
const buildMap = (roomDefintions) => {
    const map = new Map();
    const rooms = roomDefintions.map(roomDefintion => new Room(roomDefintion));
    rooms.forEach(room => map.addRoom(room));
    rooms.forEach(room => {
        // The source is the original room definition from the game file
        const roomSource = room.getSource();

        // Add adjacent rooms/doors
        (roomSource.doors ?? []).forEach(door => {
            const direction = door.direction;
            const roomId = door.roomid;
            const adjacentRoom = map.getRoomById(roomId);
            if (!adjacentRoom) throw new Error(`Cannot create adjacent room. Room with id ${roomId} not found.`);
            room.addAdjacentRoom(direction, adjacentRoom);

            const doorObj = new Door(door);
            map.doors.push(doorObj);
            room.addDoor(doorObj);
        });

        // Add items
        const keys = [];
        const containers = {};
        (roomSource.items ?? []).filter(item => C.itemTypes.includes(item.type)).forEach(item => {
            if (item.type == C.ITEM_TYPE_CONTAINER) {
                const c = new Container(item);
                containers[c.id] = c; // Quick lookup
                room.addItem(c);
            }
            else if (item.type == C.ITEM_TYPE_KEY) {
                const k = new Key(item)
                room.addItem(k);
                keys.push(k);
            }
            else if (item.type === C.ITEM_TYPE_GENERIC) {
                const g = new Item(item);
                room.addItem(g);
            }
        });

        // Add items (keys for now) to containers
        keys.forEach(key => {
            if (key.containerId) {
                const container = containers[key.containerId];
                if (!container) throw new Error(`Cannot add key to container. Container with id ${key.containerId} not found.`);
                container.addItem(key);
            }
            else {
                throw new Error(`Key ${key.id} does not specify a container.`);
            }
        });

    });

    return map;
}

export default buildMap;