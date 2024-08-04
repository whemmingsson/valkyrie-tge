import Container from "./container";
import Door from "./door";
import Item from "./item";
import Key from "./key";

class Room {
    source: any;
    adjacentRooms: {};
    id: any;
    doors: Door[];
    items: (Key | Item | Container)[];
    spawn: any;
    name: any;
    title: any;
    description: any;
    events: any[];
    constructor(source: any) {
        this.source = source;
        this.adjacentRooms = {};
        this.id = source.id; // TODO: This is not a good idea. We should use a GUID or something unique.
        this.name = source.name;
        this.title = source.title;
        this.description = source.description;
        this.events = source.events;
        this.spawn = source.spawn;
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

    addItem(item: Key | Item | Container) {
        this.items.push(item);
    }

    removeItem(item: Key | Item | Container) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            return this.items.splice(index, 1)[0];
        }
    }

    removeItemById(id: string) {
        const item = this.items.find(item => item.id === id);
        if (!item) {
            return;
        }

        this.removeItem(item);
    }

}

export default Room;