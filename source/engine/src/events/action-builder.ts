import logger from '../core/io/logger.js';
import C from '../core/constants.js';
import context from '../state/game-context.js';
import turnHelper from '../helpers/turn-action-helper.js';
import parseAnnotatedText from '../helpers/annotator.js';
import { Translation } from '../helpers/translations.js';
import checkConditions from './conditions-checker.js';
import Container from '../core/models/container.js';
import TakeableObject from '../core/models/takeableObject.js';
import { Settings } from '../core/settings.js';
import GameTypes from '../types/types.js';

interface ActionBuilder {
    buildPickupAction: (_: any, __: any, targetObject: any) => GameTypes.Action | (() => GameTypes.Action);
    buildCloseAction: (event: any, _: any, targetObject: any) => GameTypes.Action | (() => GameTypes.Action);
    buildDeleteItemInventoryAction: (event: any, __: any, targetObject: any) => GameTypes.Action | (() => GameTypes.Action);
    buildDescribeAction: (_: any, __: any, targetObject: any) => GameTypes.Action;
    buildOpenAction: (event: any, _: any, targetObject: Container) => GameTypes.Action | (() => GameTypes.Action);
    buildTurnAction: (event: any, command: any) => GameTypes.Action | (() => GameTypes.Action);
    buildErrorAction: (text: any) => () => void;
    buildSimpleTextAction: (text: string) => () => void;
    buildNoopAction: (event: any) => () => void;
    buildTextAction: (event: any) => () => void;
    buildFormattedTextAction: (template: string, text: string[]) => () => void;
    buildWarningAction: (text: string) => () => void;
    buildDebugAction: () => () => void;
    buildInventoryAction: () => () => void;
    buildActionForEvent: (event: any, command: string | undefined, targetObject: any | undefined) => GameTypes.Action;
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
    const nextDirection = turnHelper.findNextDirection(event, command, context.ctx.playerDirection);

    if (!nextDirection) {
        return wrapAction(actionBuilder.buildWarningAction(Translation.translate(Translation.ACTION_TURN_INVALID_DIRECTION_WARNING)), event);
    }

    return () => {
        context.ctx.playerDirection = nextDirection;

        const turnText = event.meta[nextDirection];
        if (turnText) {
            logger.logWithTemplate("You are facing $ \n", [nextDirection.toLowerCase()]);
            return wrapAction(actionBuilder.buildSimpleTextAction(turnText));
        }

        return wrapAction(actionBuilder.buildNoopAction(event));
    }
}

// Opens a container object
actionBuilder.buildOpenAction = (event, _, targetObject: Container) => {
    if (!targetObject) {
        return wrapAction(actionBuilder.buildWarningAction(Translation.translate(Translation.ACTION_OPEN_NO_TARGET_WARNING)));
    }

    return () => {
        targetObject.open();

        const primaryAction = event.meta.text
            ? actionBuilder.buildTextAction(event)
            : actionBuilder.buildFormattedTextAction(event.meta.fallback_text, [targetObject.name]);

        if (!Settings.ENABLE_AUTO_PICKUP) {
            return wrapAction(primaryAction, event, targetObject);
        }

        return wrapAction(actionBuilder.buildNoopAction(event), event);

        /*// This logic is only for the auto-pickup feature
        const itemsWithAutoPickup = targetObject.getItemsWithAutoPickup();
        const secondaryAction = itemsWithAutoPickup.length > 0
            ? actionBuilder.buildPickupAction(_, _, itemsWithAutoPickup[0])
            : actionBuilder.buildNoopAction(event);

        return wrapAction(() => { primaryAction(); return secondaryAction(); }); */
    }
}

// Closes a container object
actionBuilder.buildCloseAction = (event, _, targetObject) => {
    if (!targetObject) {
        return wrapAction(actionBuilder.buildWarningAction(Translation.translate(Translation.ACTION_CLOSE_NO_TARGET_WARNING)));
    }

    return () => {
        targetObject.close();

        if (event.meta.text)
            return wrapAction(actionBuilder.buildTextAction(event));

        return wrapAction(actionBuilder.buildFormattedTextAction(event.meta.fallback_text, [targetObject.name]));
    }
}

// Describes an object
actionBuilder.buildDescribeAction = (_, __, targetObject) => {
    if (!targetObject) {
        return wrapAction(actionBuilder.buildWarningAction(Translation.translate(Translation.ACTION_DESCRIBE_NO_TARGET_WARNING)));
    }

    return wrapAction(actionBuilder.buildSimpleTextAction(targetObject.description ?? targetObject.source.description ?? Translation.translate(Translation.ACTION_DESCRIBE_NO_DESCRIPTION_INFO)));
}

// Picks up an object (takeable object)
actionBuilder.buildPickupAction = (_, __, targetObject) => {
    if (!targetObject) {
        return wrapAction(actionBuilder.buildWarningAction(Translation.translate(Translation.ACTION_PICKUP_NO_TARGET_WARNING)));
    }

    if (targetObject && !targetObject.visible) {
        return wrapAction(actionBuilder.buildWarningAction(context.ctx.inventory.hasItem(targetObject)
            ? Translation.translate(Translation.ACTION_PICKUP_NO_TARGET_IN_INVENTORY_WARNING)
            : Translation.translate(Translation.ACTION_PICKUP_NO_TARGET_WARNING)));
    }

    return () => {
        context.ctx.inventory.addItem(targetObject);
        targetObject.visible = false;
        targetObject.removeFromParent();
        context.ctx.currentRoom.removeItem(targetObject);
        return wrapAction(actionBuilder.buildFormattedTextAction("You pick up the $.", [targetObject.name]), _, targetObject); // Uhm. It's kinda correct, but not really
    }
}

// Deletes an item from the player's inventory
actionBuilder.buildDeleteItemInventoryAction = (event, __, targetObject) => {
    if (!targetObject) {
        return wrapAction(actionBuilder.buildWarningAction(Translation.translate(Translation.ACTION_DELETE_ITEM_INVENTORY_NO_TARGET_WARNING)));
    }

    if (!context.ctx.inventory.hasItem(targetObject)) {
        return wrapAction(actionBuilder.buildWarningAction(Translation.translate(Translation.ACTION_DELETE_ITEM_INVENTORY_NO_TARGET_WARNING)));
    }

    return () => {
        context.ctx.inventory.removeItem(targetObject);

        if (event.meta.text)
            return wrapAction(actionBuilder.buildTextAction(event), event, targetObject);

        return wrapAction(actionBuilder.buildNoopAction(event), event, targetObject);
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
    [C.EVENT_ACTION_DELETE_ITEM_INVENTORY]: actionBuilder.buildDeleteItemInventoryAction,
};

// Wraps the action function together with some metadata, first iteration is just the action type and target object
const wrapAction = (action: (() => void | GameTypes.Action) | GameTypes.Action, event?: any | undefined, targetObject?: any): GameTypes.Action => {
    if (typeof action === 'function') {
        let type = "UNKNOWN" as GameTypes.ActionType;
        if (event && event.action) {
            type = event.action as GameTypes.ActionType;
        }
        return { execute: action, type: type, target: targetObject };
    }

    return action; // Already wrapped
}

// Resolves action from an event
actionBuilder.buildActionForEvent = (event, command: any | undefined, targetObject: any | undefined) => {
    // These two scenarios should really not happen, but just in case
    if (!event) {
        return wrapAction(actionBuilder.buildErrorAction("No event found to handle.\n"));
    }
    if (!event.action) {
        return wrapAction(actionBuilder.buildErrorAction(`Event with trigger '${event.trigger}' does not have an action. Please report this as a bug to the game developer.\n`));
    }

    const buildAction = actionBuilderMap[event.action];
    if (!buildAction) {
        return wrapAction(actionBuilder.buildErrorAction(`No action builder found for action '${event.action}'. Please report this as a bug to the Valkyrie developer.\n`));
    }

    // Check of conditions are met
    const failedCondition = checkConditions(event.conditions, targetObject);
    if (failedCondition) {
        if (targetObject && targetObject.name) {
            if (failedCondition.meta.text)
                return wrapAction(actionBuilder.buildSimpleTextAction(failedCondition.meta.text));

            return wrapAction(actionBuilder.buildFormattedTextAction(failedCondition.meta.fallback_text, [targetObject.name]));
        }

        return wrapAction(actionBuilder.buildWarningAction(failedCondition.meta.text));
    }

    return wrapAction(buildAction(event, command, targetObject));
}

export { actionBuilder, wrapAction };