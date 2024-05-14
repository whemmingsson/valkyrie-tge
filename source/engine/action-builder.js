const logger = require('../core/io/logger');
const C = require('../core/constants');
const context = require('./game-context');
const actionBuilder = {}

// Builders
actionBuilder.buildTextAction = (text) => {
    return () => logger.log(text);
}

actionBuilder.buildWarningAction = (text) => {
    return () => logger.warn(text);
}

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
        case C.EVENT_ACTION_TEXT: return actionBuilder.buildTextAction(event.meta.text);
        case C.EVENT_ACTION_DEBUG: return actionBuilder.buildDebugAction();
    }
}



module.exports = actionBuilder;