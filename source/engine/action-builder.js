const logger = require('../core/io/logger');
const C = require('../core/constants');
const actionBuilder = {}

actionBuilder.buildTextAction = (text) => {
    return () => logger.log(text);
}

actionBuilder.buildWarningAction = (text) => {
    return () => logger.warn(text);
}

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
    }
}



module.exports = actionBuilder;