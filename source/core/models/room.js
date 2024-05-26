class Room {
    constructor(roomDefinition) {
        this.roomDefinition = roomDefinition;
        this.adjacentRooms = {};
        this.id = roomDefinition.id; // TODO: This is not a good idea. We should use a GUID or something unique.
        this.doors = [];
        this.items = [];
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

    addDoor(door) {
        this.doors.push(door);
    }

    addItem(item) {
        this.items.push(item);
    }

}

module.exports = Room;