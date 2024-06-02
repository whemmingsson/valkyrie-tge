class Map {
    constructor() {
        this.rooms = [];
        this.doors = [];
    }

    addRoom(room) {
        this.rooms.push(room);
    }

    getRoomById(id) {
        return this.rooms.find(room => room.id === id);
    }
}

export default Map;