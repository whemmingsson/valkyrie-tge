import context from "../../state/game-context.js";
import C from '../../core/constants.js';

// Yet another concept - the hooks.
// This maps certain event types to custom actions built into the engine.
export const actionHooks = {
    [C.EVENT_TRIGGER_ENTER]: () => {
        // Basically everything the game needs to update when the player enters a room
        const roomId = context.ctx.currentRoom['id'];
        if (!context.ctx.roomVisits[roomId]) {
            context.ctx.roomVisits[roomId] = 0;
        }
        context.ctx.roomVisits[roomId]++;
    },
};