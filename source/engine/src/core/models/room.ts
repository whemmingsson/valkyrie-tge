import Door from "./door";
import Key from "./key";

class Room {
    source: any;
    adjacentRooms: {};
    id: any;
    doors: Door[];
    items: Key[];
    constructor(source: any) {
        this.source = source;
        this.adjacentRooms = {};
        this.id = source.id; // TODO: This is not a good idea. We should use a GUID or something unique.
        this.doors = [];
        this.items = [];
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

    addItem(item: Key) {
        this.items.push(item);
    }

}

export default Room;