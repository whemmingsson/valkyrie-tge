import logger from './core/io/logger.js';
import C from './core/constants.js';
import context from './game-context.js';
import turnHelper from './turn-action-helper.js';
import conditionsChecker from './conditions-checker.js';
import parseAnnotatedText from './annotator.js';

interface ActionBuilder {
    buildSimpleTextAction: (text: string) => () => void;
    buildNoopAction: (event: any) => () => void;
    buildTextAction: (event: any) => () => void;
    buildFormattedTextAction: (template: string, text: string[]) => () => void;
    buildWarningAction: (text: string) => () => void;
    buildDebugAction: () => () => void;
    buildInventoryAction: () => () => void;
    buildTurnAction: (event: any, command: string) => () => string;
    buildOpenAction: (event: any, _: any, targetObject: any) => () => void;
    buildCloseAction: (event: any, _: any, targetObject: any) => () => void;
    buildDescribeAction: (_: any, __: any, targetObject: any) => () => void;
    buildActionForEvent: (event: any, command: string | undefined, targetObject: any | undefined) => () => void;
}

const actionBuilder = {} as ActionBuilder;

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

        const elements = parseAnnotatedText(event.meta.text);
        logger.logAnnotated(elements);
    }
}

//  The most common action - displaying text to the player (simple version without use of action hooks. Only for use when no event is available)
actionBuilder.buildSimpleTextAction = (text: string) => {
    return () => {
        const elements = parseAnnotatedText(text);
        logger.logAnnotated(elements);
    }
}

// Formatted text action - displays text with a template
actionBuilder.buildFormattedTextAction = (template, text) => {
    return () => {
        logger.logWithTemplate(template, text);
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
            logger.logWithTemplate("You are facing $ \n", [nextDirection.toLowerCase()]);
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
    return () => {
        targetObject.open();

        if (event.meta.text)
            return actionBuilder.buildTextAction(event);

        return actionBuilder.buildFormattedTextAction(event.meta.fallback_text, [targetObject.name]);
    }
}

actionBuilder.buildCloseAction = (event, _, targetObject) => {
    if (!targetObject) {
        return actionBuilder.buildWarningAction("No target object found to close. Did you spell it correctly?\n");
    }
    return () => {
        targetObject.close();
        console.log(event);
        return actionBuilder.buildFormattedTextAction(event.meta.text, [targetObject.name]);
    }
}

actionBuilder.buildDescribeAction = (_, __, targetObject) => {
    if (!targetObject) {
        return actionBuilder.buildWarningAction("No target object found to describe. Did you spell it correctly?\n");
    }

    return () => {
        logger.log(targetObject.description ?? targetObject.source.description ?? "There is nothing special about this object.");
    }
}

// This maps event actions to the actual action builders
// If an command does not resolve to an action - did you forget to add it here?
const actionBuilderMap = {
    [C.EVENT_ACTION_TEXT]: actionBuilder.buildTextAction,
    [C.EVENT_ACTION_DEBUG]: actionBuilder.buildDebugAction,
    [C.EVENT_ACTION_INVENTORY]: actionBuilder.buildInventoryAction,
    [C.EVENT_ACTION_TURN]: actionBuilder.buildTurnAction,
    [C.EVENT_ACTION_OPEN]: actionBuilder.buildOpenAction,
    [C.EVENT_ACTION_CLOSE]: actionBuilder.buildCloseAction,
    [C.EVENT_ACTION_DESCRIBE]: actionBuilder.buildDescribeAction,
};

// Resolves action from an event
actionBuilder.buildActionForEvent = (event, command: any | undefined, targetObject: any | undefined) => {
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
    const failedCondition = conditionsChecker.check(event.conditions, targetObject);
    if (failedCondition) {
        if (targetObject && targetObject.name) {
            if (failedCondition.meta.text)
                return actionBuilder.buildSimpleTextAction(failedCondition.meta.text);

            return actionBuilder.buildFormattedTextAction(failedCondition.meta.fallback_text, [targetObject.name]);
        }

        return actionBuilder.buildWarningAction(failedCondition.meta.text);
    }

    return buildAction(event, command, targetObject);
}

export default actionBuilder;