const logger = require('../core/io/logger');
const C = require('../core/constants');
const context = require('./game-context');
const actionBuilder = {}

// Yet another concept - the hooks.
// This maps certain event types to custom actions built into the engine.
const actionHooks = {
    [C.EVENT_TRIGGER_ENTER]: () => {
        logger.debug("DEBUG: Triggering enter room hook.");
        // Basically everything the game needs to update when the player enters a room
        const roomId = context.ctx.currentRoom['_id'];
        logger.debug(`DEBUG: Room ID: ${roomId}`);
        logger.debug(context.ctx.roomVisits);
        if (!context.ctx.roomVisits[roomId]) {
            context.ctx.roomVisits[roomId] = 0;
        }
        context.ctx.roomVisits[roomId]++;
        logger.debug(context.ctx.roomVisits);
    }
};

// Builders

//  The most common action - displaying text to the player
actionBuilder.buildTextAction = (event) => {
    return () => {
        const hook = actionHooks[event.trigger];
        if (hook) {
            hook();
        }
        logger.log(event.meta.text);
    }
}

// Warning action - do we need this?
actionBuilder.buildWarningAction = (text) => {
    return () => {
        logger.warn(text);
    }
}

// Debug action for debugging purposes - for game developers
actionBuilder.buildDebugAction = () => {
    return () => {
        context.print();
    }
}

// Resolves action from an event
actionBuilder.buildActionForEvent = (event) => {
    // These two scenarios should really not happen, but just in case
    if (!event) {
        return actionBuilder.buildWarningAction("No event found to handle.\n");
    }
    if (!event.action) {
        return actionBuilder.buildWarningAction(`Event with trigger '${event.trigger}' does not have an action. Please report this as a bug to the game developer.\n`);
    }

    switch (event.action) {
        case C.EVENT_ACTION_TEXT: return actionBuilder.buildTextAction(event);
        case C.EVENT_ACTION_DEBUG: return actionBuilder.buildDebugAction();
    }
}



module.exports = actionBuilder;