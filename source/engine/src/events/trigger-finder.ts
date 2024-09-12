import output from "../core/io/output.js";
import GameObject from "../core/models/gameObject.js";
import { getContext } from "../state/game-context.js";
import { findById } from "../world/object-finder.js";
import { buildActionForEvent } from "./actionBuilder.js";

const ctx = getContext().ctx;

export namespace TriggeredEvents {
    export function findTriggeredEvent(originalAction: string, orginalTarget: GameObject) {
        const triggeredEvents = ctx.currentRoom.events
            .filter(event => event.trigger === originalAction) // Filter by action
            .filter(event => event.meta && event.meta.sourceid === orginalTarget.id); // Filter by target - yes, it's sourceId

        if (triggeredEvents.length > 1) {
            output.error(`Multiple events found for trigger '${originalAction}'. Please report this as a bug to the game developer.`);
            return null;
        }

        if (triggeredEvents.length === 0) {
            return null;
        }

        // Now, we have found a matching event. Do the matching target exist?
        const newTarget = findById(triggeredEvents[0].meta.targetid);

        // In our example, the target is the same as the original target, but it could be different.

        // Build and the proper action for this event
        return buildActionForEvent(triggeredEvents[0], undefined, newTarget);
    }
}