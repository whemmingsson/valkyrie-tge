import checkConditions from './conditions-checker.js';
import {
    buildErrorAction,
    buildFormattedTextAction,
    buildWarningAction,
    buildNoopAction
} from './actions/actionBuilders.js';
import GameObject from '../core/models/gameObject.js';
import { ActionBuilder } from '../core/types/actionBuilder.js';
import { Action } from '../core/types/action.js';
import { GameEvent } from '../core/types/event.js';
import { actionRegistry } from './actions/actionRegistry.js';

const handleFailedCondition = (failedCondition: any, targetObject: GameObject) => {
    const { text, fallback_text } = failedCondition.meta;

    return text
        ? buildWarningAction(text)
        : targetObject?.name
            ? buildFormattedTextAction(fallback_text, [targetObject.name])
            : buildNoopAction();
}

const buildActionForEvent = (event?: GameEvent, command?: string, targetObject?: GameObject): Action => {
    if (!event) {
        return buildErrorAction("No event found to handle.\n");
    }
    if (!event.action) {
        return buildErrorAction(`Event with trigger '${event.trigger}' does not have an action. Please report this as a bug to the game developer.\n`);
    }

    const failedCondition = checkConditions(event.conditions, targetObject);
    if (failedCondition) {
        return handleFailedCondition(failedCondition, targetObject);
    }

    const action = actionRegistry.get()[event.action] as ActionBuilder
        ?? (() => buildErrorAction(`No action builder found for action '${event.action}'. Please report this as a bug to the Valkyrie developer.\n`));

    return action(event, command, targetObject);
}

export { buildActionForEvent };