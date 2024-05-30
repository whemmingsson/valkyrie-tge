const actionBuilder = require('./action-builder');
const ctx = require('./game-context').ctx;
const C = require('./core/constants');
const builtInEvents = require('./game-events').all;

class TriggerResolver {
    constructor(game) {
        this.events = game.events;
        this.globalEvents = this.events.filter(event => event.scope === C.EVENT_SCOPE_GLOBAL).concat(builtInEvents);
    }

    resolve(trigger) {
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
            return actionBuilder.buildActionForEvent(matchingEvents[0]);
        }

        return null;
    }
}

module.exports = TriggerResolver;