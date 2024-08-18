import Room from '../core/models/room.js';
import Door from '../core/models/door.js';
import GameMap from '../core/models/map.js';
import Key from '../core/models/key.js';
import Container from '../core/models/container.js';
import Generic from '../core/models/generic.js';
import output from '../core/io/output.js';
import { ITEM_TYPE_CONTAINER, ITEM_TYPE_GENERIC, ITEM_TYPE_KEY, ItemTypes } from '../core/constants/itemTypes.js';

// This builder is responsible for creating the map object from the game definition
// The map object is a collection of rooms, doors, and items
// The map object is used by the game runner to navigate the game world

// A decision needs to to made about if we really need this builder
const buildMap = (roomDefintions) => {
    const map = new GameMap();
    const rooms = roomDefintions.map(roomDefintion => new Room(roomDefintion)) as Room[];
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
        const containersMap = {}; // Quick lookup of containers by id
        const items = [];
        (roomSource.items ?? []).filter(item => ItemTypes.includes(item.type)).forEach(item => {
            if (item.type == ITEM_TYPE_CONTAINER) {
                const c = new Container(item);
                containersMap[c.id] = c; // Quick lookup
                room.addItem(c);
                items.push(c);
            }
            else if (item.type == ITEM_TYPE_KEY) {
                const k = new Key(item)
                room.addItem(k);
                items.push(k);
            }
            else if (item.type === ITEM_TYPE_GENERIC) {
                const g = new Generic(item);
                room.addItem(g);
                items.push(g);
            }
        });


        // Add items to containers
        items.forEach(item => {
            if (item.containerId) {
                const container = containersMap[item.containerId];
                if (!container) {
                    output.warn(`Cannot add item with id ${item.id} to container. Container with id ${item.containerId} not found. This is a known issue. The container might be a room`);
                    return;
                }

                container.addItem(item);
            }
            else {
                throw new Error(`Item ${item.id} does not specify a container.`);
            }
        });
    });

    return map;
}

export default buildMap;