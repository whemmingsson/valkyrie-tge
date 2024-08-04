import Container from "./container.js";
import Door from "./door.js";

class Room extends Container {
    source: any;
    adjacentRooms: {};
    title: any;
    spawn: any;
    doors: any[];
    constructor(source: any) {
        super(source);
        this.source = source;
        this.adjacentRooms = {};
        this.title = source.title;
        this.spawn = source.spawn;
        this.doors = [];
    }

    addAdjacentRoom(direction: string, room: Room) {
        this.adjacentRooms[direction] = room;
    }

    getAdjacentRoom(direction: string) {
        return this.adjacentRooms[direction];
    }

    getSource() {
        return this.source;
    }

    addDoor(door: Door) {
        this.doors.push(door);
    }
}

export default Room;