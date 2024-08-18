import checkConditions from './conditions-checker.js';
import {
    buildDebugAction,
    buildTextAction,
    buildInventoryAction,
    buildTurnAction,
    buildOpenAction,
    buildDescribeAction,
    buildPickupAction,
    buildDeleteItemInventoryAction,
    buildErrorAction,
    buildFormattedTextAction,
    buildWarningAction,
    buildUnlockAction,
    buildNoopAction
} from './actions/actionBuilders.js';
import GameObject from '../core/models/gameObject.js';
import { ACTION_DEBUG, ACTION_DELETE_ITEM_INVENTORY, ACTION_DESCRIBE, ACTION_INVENTORY, ACTION_OPEN, ACTION_PICK_UP, ACTION_TEXT, ACTION_TURN, ACTION_UNLOCK } from '../core/constants/events/actionTypes.js';
import { ActionBuilder } from '../core/types/actionBuilder.js';
import { Action } from '../core/types/action.js';
import { GameEvent } from '../core/types/event.js';

interface ActionBuilderMap {
    [key: string]: ActionBuilder;
}

// This maps event actions to the actual action builders
// NOTE: If an command does not resolve to an action - did you forget to add it here?
const actionBuilderMap: ActionBuilderMap = {
    [ACTION_TEXT]: buildTextAction,
    [ACTION_DEBUG]: buildDebugAction,
    [ACTION_INVENTORY]: buildInventoryAction,
    [ACTION_TURN]: buildTurnAction,
    [ACTION_OPEN]: buildOpenAction,
    [ACTION_DESCRIBE]: buildDescribeAction,
    [ACTION_PICK_UP]: buildPickupAction,
    [ACTION_DELETE_ITEM_INVENTORY]: buildDeleteItemInventoryAction,
    [ACTION_UNLOCK]: buildUnlockAction
};

// Resolves action for an event
const buildActionForEvent = (event?: GameEvent, command?: string, targetObject?: GameObject): Action => {

    // These two scenarios should really not happen, but just in case
    if (!event) {
        return buildErrorAction("No event found to handle.\n");
    }
    if (!event.action) {
        return buildErrorAction(`Event with trigger '${event.trigger}' does not have an action. Please report this as a bug to the game developer.\n`);
    }

    // Check if conditions are met
    const failedCondition = checkConditions(event.conditions, targetObject);
    if (failedCondition) {
        const { text, fallback_text } = failedCondition.meta;

        return text
            ? buildWarningAction(text)
            : targetObject?.name
                ? buildFormattedTextAction(fallback_text, [targetObject.name])
                : buildNoopAction();
    }

    const action = actionBuilderMap[event.action] as ActionBuilder
        ?? (() => buildErrorAction(`No action builder found for action '${event.action}'. Please report this as a bug to the Valkyrie developer.\n`));

    return action(event, command, targetObject);
}

export { buildActionForEvent };