import Door from "./door";
import Room from "./room";

class GameMap {
    rooms: Room[];
    doors: Door[];
    constructor() {
        this.rooms = [];
        this.doors = [];
    }

    addRoom(room: Room) {
        this.rooms.push(room);
    }

    getRoomById(id: string) {
        return this.rooms.find(room => room.id === id);
    }
}

export default GameMap;