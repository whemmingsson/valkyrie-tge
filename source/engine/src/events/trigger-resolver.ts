import actionBuilder from './action-builder.js';
import Context from '../state/game-context.js'
import C from '../core/constants.js';
import builtInEvents from './game-events.js';

const ctx = Context.ctx;

class TriggerResolver {
    events: any;
    globalEvents: any;
    constructor(game: any) {
        this.events = game.events;
        this.globalEvents = this.events.filter(event => event.scope === C.EVENT_SCOPE_GLOBAL).concat(builtInEvents.all);
    }

    resolve(trigger: any) {
        if (!trigger) {
            return null;
        }

        // This resolver only deals with events that are not triggered by player commands. For now.
        const roomEvents = ctx.currentRoom.events.filter(event => event.trigger !== C.EVENT_TRIGGER_COMMAND && event.scope === C.EVENT_SCOPE_ROOM);
        const triggerEvents = this.globalEvents.filter(event => event.trigger !== C.EVENT_TRIGGER_COMMAND).concat(roomEvents);

        const matchingEvents = triggerEvents.filter(event => event.trigger === trigger);

        if (matchingEvents.length > 1) {
            return actionBuilder.buildWarningAction(`Multiple events found for trigger '${trigger}'. Please report this as a bug to the game developer.`);
        }

        if (matchingEvents.length === 1) {
            return actionBuilder.buildActionForEvent(matchingEvents[0], undefined, undefined);
        }

        return null;
    }
}

export default TriggerResolver;