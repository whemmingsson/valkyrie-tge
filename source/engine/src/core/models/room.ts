import Container from "./container.js";
import Door from "./door.js";

class Room extends Container {
    adjacentRooms: {};
    title: string;
    spawn: boolean;
    doors: Door[];
    constructor(source: any) {
        super(source);
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