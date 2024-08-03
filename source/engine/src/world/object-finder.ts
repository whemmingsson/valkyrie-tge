import Context from '../state/game-context.js';

const ctx = Context.ctx;

const objectFinder = {
    find: (targetName: string) => {
        const room = ctx.currentRoom;

        // So the targetName is a type of object. We need to find it in the current room + current direction.
        // First, check the room's items. This is not really enough as we need take the player's direction into account.
        const item = ctx.currentRoom.items.find((item) => item.name === targetName && (item.direction ?? '').toUpperCase() === ctx.playerDirection);

        if (item) {
            return item;
        }

        // Check the rooms doors in the current direction
        if (targetName === "door") {
            const doors = room.doors.filter((door) => door.direction.toUpperCase() === ctx.playerDirection);
            if (doors) {
                return doors[0];
            }
            else {
                // Here we have multiple doors in the same direction. We need to ask the player which one they mean.
                // Maybe construct a new type of action?
            }
        }

        // Describe the room
        if (targetName === "room") {
            return room;
        }

        return null; // Target not found
    },

    findById: (id: string) => {
        const item = ctx.currentRoom.items.find((item) => item.id === id);
        if (item) {
            return item;
        }

        return null; // Target not found
    }
}

export default objectFinder;