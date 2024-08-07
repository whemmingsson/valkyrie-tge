import logger from "../core/io/logger";
import GameObject from "../core/models/gameObject";
import gameContext from "../state/game-context";
import objectFinder from "../world/object-finder";
import actionBuilder from "./action-builder";

const ctx = gameContext.ctx;

export namespace TriggeredEvents {
    export function findTriggeredEvent(originalAction: string, orginalTarget: GameObject) {
        // So, when an action with resolved with name "orginalAction", and the target is "orginalTarget", we need to find the trigger that matches this action and target, if any.

        // Right now, this is the only defined triggered event that we support:
        /*
    
         {
            "scope": "ITEM", -- This is the scope of the event. It can be ITEM, ROOM, GLOBAL
            "trigger": "OPEN", -- This is the trigger that will be resolved
            "action": "DELETE_ITEM_INVENTORY", -- This is the action that will be executed
            "meta": {
                "sourceid:": "g_2", // When g2 is opened, it will be deleted
                "targetid": "g_2"
            }
         }
       */

        const triggeredEvents = ctx.currentRoom.events
            .filter(event => event.trigger === originalAction) // Filter by action
            .filter(event => event.meta && event.meta.sourceid === orginalTarget.id); // Filter by target - yes, it's sourceId

        if (triggeredEvents.length > 1) {
            logger.error(`Multiple events found for trigger '${originalAction}'. Please report this as a bug to the game developer.`);
            return null;
        }

        if (triggeredEvents.length === 0) {
            return null;
        }

        // Now, we have found a matching event. Do the matching target exist?
        const newTarget = objectFinder.findById(triggeredEvents[0].meta.targetid);

        // In our example, the target is the same as the original target, but it could be different.

        // Build and the proper action for this event
        return actionBuilder.buildActionForEvent(triggeredEvents[0], undefined, newTarget);
    }
}