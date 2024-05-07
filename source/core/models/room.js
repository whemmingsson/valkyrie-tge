class Room {
    constructor(roomDefinition) {
        this.roomDefinition = roomDefinition;
        this.adjacentRooms = {};
        this.id = roomDefinition._id; // TODO: This is not a good idea. We should use a GUID or something unique.
    }

    addAdjacentRoom(direction, room) {
        this.adjacentRooms[direction] = room;
    }

    getAdjacentRoom(direction) {
        return this.adjacentRooms[direction];
    }

    getRoomDefinition() {
        return this.roomDefinition;
    }
}

module.exports = Room;