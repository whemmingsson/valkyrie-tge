const logger = require('../core/io/logger');
const C = require('../core/constants');
const context = require('./game-context');
const turnHelper = require('./turn-action-helper');
const actionBuilder = {}

// Yet another concept - the hooks.
// This maps certain event types to custom actions built into the engine.
const actionHooks = {
    [C.EVENT_TRIGGER_ENTER]: () => {
        // Basically everything the game needs to update when the player enters a room
        const roomId = context.ctx.currentRoom['_id'];
        if (!context.ctx.roomVisits[roomId]) {
            context.ctx.roomVisits[roomId] = 0;
        }
        context.ctx.roomVisits[roomId]++;
    },
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

// Inventory action - displays the player's inventory
actionBuilder.buildInventoryAction = () => {
    return () => {
        context.ctx.inventory.print();
    }
}

// Turn action - turns the player
actionBuilder.buildTurnAction = (event, command) => {
    const nextDirection = turnHelper.findNextDirection(event, command, context.ctx.playerDirection);
    return () => {
        if (nextDirection) {
            context.ctx.playerDirection = nextDirection;
            logger.message("You are facing $ \n", [nextDirection.toLowerCase()]);
        } else {
            logger.warn('Invalid turn command. Please try again.');
        }
    }
}

// Resolves action from an event
actionBuilder.buildActionForEvent = (event, command) => {
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
        case C.EVENT_ACTION_INVENTORY: return actionBuilder.buildInventoryAction();
        case C.EVENT_ACTION_TURN: return actionBuilder.buildTurnAction(event, command);
    }
}



module.exports = actionBuilder;