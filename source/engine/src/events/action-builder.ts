import C from '../core/constants.js';
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
    buildSimpleTextAction,
    buildFormattedTextAction,
    buildWarningAction,
    buildUnlockAction,
    buildNoopAction
} from './actions/actionBuilders.js';
import Types from '../types/types.js';

interface ActionBuilderMap {
    [key: string]: Types.ActionBuilder;
}

// This maps event actions to the actual action builders
// NOTE: If an command does not resolve to an action - did you forget to add it here?
const actionBuilderMap: ActionBuilderMap = {
    [C.EVENT_ACTION_TEXT]: buildTextAction,
    [C.EVENT_ACTION_DEBUG]: buildDebugAction,
    [C.EVENT_ACTION_INVENTORY]: buildInventoryAction,
    [C.EVENT_ACTION_TURN]: buildTurnAction,
    [C.EVENT_ACTION_OPEN]: buildOpenAction,
    [C.EVENT_ACTION_DESCRIBE]: buildDescribeAction,
    [C.EVENT_ACTION_PICK_UP]: buildPickupAction,
    [C.EVENT_ACTION_DELETE_ITEM_INVENTORY]: buildDeleteItemInventoryAction,
    [C.EVENT_ACTION_UNLOCK]: buildUnlockAction
};

// Resolves action for an event
const buildActionForEvent = (event, command: any | undefined, targetObject: any | undefined): Types.Action => {

    // These two scenarios should really not happen, but just in case
    if (!event) {
        return buildErrorAction("No event found to handle.\n");
    }
    if (!event.action) {
        return buildErrorAction(`Event with trigger '${event.trigger}' does not have an action. Please report this as a bug to the game developer.\n`);
    }

    // Check of conditions are met
    const failedCondition = checkConditions(event.conditions, targetObject);
    if (failedCondition) {
        const { text, fallback_text } = failedCondition.meta;

        return text
            ? buildWarningAction(text)
            : targetObject?.name
                ? buildFormattedTextAction(fallback_text, [targetObject.name])
                : buildNoopAction();
    }

    const action = actionBuilderMap[event.action] as Types.ActionBuilder
        ?? (() => buildErrorAction(`No action builder found for action '${event.action}'. Please report this as a bug to the Valkyrie developer.\n`));

    return action(event, command, targetObject);
}

export { buildActionForEvent };