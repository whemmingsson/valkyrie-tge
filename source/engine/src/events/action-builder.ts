import logger from '../core/io/logger.js';
import C from '../core/constants.js';
import context from '../state/game-context.js';
import turnHelper from '../helpers/turn-action-helper.js';
import parseAnnotatedText from '../helpers/annotator.js';
import Room from '../core/models/room.js';
import { Translation } from '../helpers/translations.js';
import checkConditions from './conditions-checker.js';
import Container from '../core/models/container.js';
import TakeableObject from '../core/models/takeableObject.js';

interface ActionBuilder {
    buildErrorAction: (text: any) => () => void;
    buildPickupAction: (_: any, __: any, targetObject: any) => () => void;
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

// Filter out conditional texts that should not be displayed
const filterConditionalTexts = (collection): string[] => {
    const textsToDisplay = [];

    collection.forEach((item) => {
        if (item.conditions && !checkConditions(item.conditions)) {
            textsToDisplay.push(item.text);
        }
        else if (!item.conditions) {
            textsToDisplay.push(item);
        }
    });

    return textsToDisplay;
}

const logText = (text: string | any[]) => {
    if (typeof text === 'string') {
        logger.logAnnotated(parseAnnotatedText(text))
    }
    else {
        filterConditionalTexts(text).forEach((t) => {
            logger.logAnnotated(parseAnnotatedText(t));
        });
    }
}

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

        logText(event.meta.text);
    }
}

//  The most common action - displaying text to the player (simple version without use of action hooks. Only for use when no event is available)
actionBuilder.buildSimpleTextAction = (text: string | string[]) => {
    return () => {
        logText(text);
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

// Error action 
actionBuilder.buildErrorAction = (text) => {
    return () => {
        logger.error(text);
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

actionBuilder.buildOpenAction = (event, _, targetObject: Container) => {
    if (!targetObject) {
        return actionBuilder.buildWarningAction(Translation.translate(Translation.ACTION_OPEN_NO_TARGET_WARNING));
    }

    return () => {
        targetObject.open();

        const primaryAction = event.meta.text
            ? actionBuilder.buildTextAction(event)
            : actionBuilder.buildFormattedTextAction(event.meta.fallback_text, [targetObject.name]);

        // This is a bit of a hack - we should probably have a better way to handle this
        // The issue is that we now have two actions that are dependent on the same event
        // We are also calling the action directly, which is not ideal.
        const itemsWithAutoPickup = targetObject.getItemsWithAutoPickup();
        const secondaryAction = itemsWithAutoPickup.length > 0
            ? actionBuilder.buildPickupAction(_, _, itemsWithAutoPickup[0])
            : actionBuilder.buildNoopAction(event);

        return () => { primaryAction(); return secondaryAction(); };
    }
}

actionBuilder.buildCloseAction = (event, _, targetObject) => {
    if (!targetObject) {
        return actionBuilder.buildWarningAction(Translation.translate(Translation.ACTION_CLOSE_NO_TARGET_WARNING));
    }

    return () => {
        targetObject.close();

        if (event.meta.text)
            return actionBuilder.buildTextAction(event);

        return actionBuilder.buildFormattedTextAction(event.meta.fallback_text, [targetObject.name]);
    }
}

actionBuilder.buildDescribeAction = (_, __, targetObject) => {
    if (!targetObject || (!targetObject.visible && !(targetObject instanceof Room))) {
        return actionBuilder.buildWarningAction(Translation.translate(Translation.ACTION_DESCRIBE_NO_TARGET_WARNING));
    }

    return actionBuilder.buildSimpleTextAction(targetObject.description ?? targetObject.source.description ?? Translation.translate(Translation.ACTION_DESCRIBE_NO_DESCRIPTION_INFO));
}

actionBuilder.buildPickupAction = (_, __, targetObject: TakeableObject) => {
    if (!targetObject) {
        return actionBuilder.buildWarningAction(Translation.translate(Translation.ACTION_PICKUP_NO_TARGET_WARNING));
    }

    if (targetObject && !targetObject.visible) {
        return actionBuilder.buildWarningAction(context.ctx.inventory.hasItem(targetObject)
            ? Translation.translate(Translation.ACTION_PICKUP_NO_TARGET_IN_INVENTORY_WARNING)
            : Translation.translate(Translation.ACTION_PICKUP_NO_TARGET_WARNING));
    }

    return () => {
        context.ctx.inventory.addItem(targetObject);
        targetObject.visible = false;
        targetObject.removeFromParent();
        return actionBuilder.buildFormattedTextAction("You pick up the $.", [targetObject.name]); // Uhm. It's kinda correct, but not really
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
    [C.EVENT_ACTION_PICK_UP]: actionBuilder.buildPickupAction,
};

// Resolves action from an event
actionBuilder.buildActionForEvent = (event, command: any | undefined, targetObject: any | undefined) => {
    // These two scenarios should really not happen, but just in case
    if (!event) {
        return actionBuilder.buildErrorAction("No event found to handle.\n");
    }
    if (!event.action) {
        return actionBuilder.buildErrorAction(`Event with trigger '${event.trigger}' does not have an action. Please report this as a bug to the game developer.\n`);
    }

    const buildAction = actionBuilderMap[event.action];
    if (!buildAction) {
        return actionBuilder.buildErrorAction(`No action builder found for action '${event.action}'. Please report this as a bug to the game developer.\n`);
    }

    // Check of conditions are met
    const failedCondition = checkConditions(event.conditions, targetObject);
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