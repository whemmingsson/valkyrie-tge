import { TRIGGER_ENTER } from "../../core/constants/events/triggerTypes.js";
import { getContext } from "../../state/game-context.js";

const ctx = getContext().ctx;

// Yet another concept - the hooks.
// This maps certain event types to custom actions built into the engine.
export const actionHooks = {
    [TRIGGER_ENTER]: () => {
        // Basically everything the game needs to update when the player enters a room
        const roomId = ctx.currentRoom['id'];
        if (!ctx.roomVisits[roomId]) {
            ctx.roomVisits[roomId] = 0;
        }
        ctx.roomVisits[roomId]++;
    },
};