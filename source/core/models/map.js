class Map {
    constructor() {
        this.rooms = [];
    }

    addRoom(room) {
        this.rooms.push(room);
    }

    getRoomById(id) {
        return this.rooms.find(room => room.id === id);
    }
}

module.exports = Map;