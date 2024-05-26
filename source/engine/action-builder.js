const logger = require('../core/io/logger');
const C = require('../core/constants');
const context = require('./game-context');
const turnHelper = require('./turn-action-helper');
const conditionsChecker = require('./conditions-checker');
const actionBuilder = {}

// Yet another concept - the hooks.
// This maps certain event types to custom actions built into the engine.
const actionHooks = {
    [C.EVENT_TRIGGER_ENTER]: () => {
        // Basically everything the game needs to update when the player enters a room
        const roomId = context.ctx.currentRoom['id'];
        if (!context.ctx.roomVisits[roomId]) {
            context.ctx.roomVisits[roomId] = 0;
        }
        context.ctx.roomVisits[roomId]++;
    },
};

// Builders

// Noop action - does nothing
actionBuilder.buildNoopAction = (_) => {
    return () => { };
};

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

// Formatted text action - displays text with a template
actionBuilder.buildFormattedTextAction = (template, text) => {
    return () => {
        logger.message(template, text);
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
    const getTrigger = (nextDirection) => {
        return C.turnTriggers.find((trigger) => trigger.indexOf(nextDirection) > -1);
    };

    const nextDirection = turnHelper.findNextDirection(event, command, context.ctx.playerDirection);
    return () => {
        if (nextDirection) {
            context.ctx.playerDirection = nextDirection;
            logger.message("You are facing $ \n", [nextDirection.toLowerCase()]);
            return getTrigger(nextDirection);
        } else {
            logger.warn('Invalid turn command. Please try again.');
        }
    }
}

actionBuilder.buildOpenAction = (event, _, targetObject) => {
    if (!targetObject) {
        return actionBuilder.buildWarningAction("No target object found to open. Did you spell it correctly?\n");
    }
    // This assumes that the target object is an item
    return () => {
        targetObject.open();
        logger.message(event.meta.text, [targetObject.name]);
        // TODO: How do we handle any extra information that needs to be displayed?

    }
}

actionBuilder.buildDescribeAction = (_, __, targetObject) => {
    if (!targetObject) {
        return actionBuilder.buildWarningAction("No target object found to describe. Did you spell it correctly?\n");
    }

    return () => {
        logger.log(targetObject.description);
    }
}

const actionBuilderMap = {
    [C.EVENT_ACTION_TEXT]: actionBuilder.buildTextAction,
    [C.EVENT_ACTION_DEBUG]: actionBuilder.buildDebugAction,
    [C.EVENT_ACTION_INVENTORY]: actionBuilder.buildInventoryAction,
    [C.EVENT_ACTION_TURN]: actionBuilder.buildTurnAction,
    [C.EVENT_ACTION_OPEN]: actionBuilder.buildOpenAction,
    [C.EVENT_ACTION_DESCRIBE]: actionBuilder.buildDescribeAction,
};

// Resolves action from an event
actionBuilder.buildActionForEvent = (event, command, targetObject) => {
    // These two scenarios should really not happen, but just in case
    if (!event) {
        return actionBuilder.buildWarningAction("No event found to handle.\n");
    }
    if (!event.action) {
        return actionBuilder.buildWarningAction(`Event with trigger '${event.trigger}' does not have an action. Please report this as a bug to the game developer.\n`);
    }

    const buildAction = actionBuilderMap[event.action];
    if (!buildAction) {
        return actionBuilder.buildWarningAction(`No action builder found for action '${event.action}'. Please report this as a bug to the game developer.\n`);
    }

    // Check of conditions are met
    // Does this belong here?
    const failedCondition = conditionsChecker.check(event.conditions, targetObject);
    if (failedCondition) {
        if (targetObject && targetObject.name)
            return actionBuilder.buildFormattedTextAction(failedCondition.meta.text, [targetObject.name]);
        return actionBuilder.buildWarningAction(failedCondition.meta.text);
    }

    return buildAction(event, command, targetObject);
}



module.exports = actionBuilder;