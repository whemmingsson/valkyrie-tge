import { buildActionForEvent } from './events/action-builder.js';
import builtInEvents from './events/game-events.js';
import Context from './state/game-context.js';
import Types from './types/types.js';
import { buildErrorAction } from './events/actions/buildErrorAction.js';
import { CONDITION_IS_NOT_OPEN, CONDITION_IS_NOT_CLOSED, CONDITION_IS_NOT_LOCKED } from './core/constants/events/conditionTypes.js';
import { MAPPINGS_RULE_EXACT, MAPPINGS_RULE_ANY, MAPPINGS_RULE_ALL } from './core/constants/events/mappingRules.js';
import { SCOPE_GLOBAL, SCOPE_ROOM, SCOPE_ITEM } from './core/constants/events/scopes.js';
import { TRIGGER_COMMAND } from './core/constants/events/triggerTypes.js';
import { META_KEY_ON_OPEN_TEXT, META_KEY_ON_CLOSED_TEXT, META_KEY_ON_LOCKED_TEXT } from './core/constants/metaKeys.js';
import { findByName } from './world/object-finder.js';

let resolverInitialized = false;
let templateEvents = [];
let globalEvents = [];

const ctx = Context.ctx;

const setupCommandResolver = (game) => {
    templateEvents = builtInEvents.templates;
    globalEvents = (game.events ?? []).filter(event => event.scope === SCOPE_GLOBAL).concat(builtInEvents.all);
    resolverInitialized = true;
}

const findTargetWord = (command: String) => {
    const commandWords = command.split(' ');
    if (!commandWords || commandWords.length < 2) {
        return null;
    }

    return commandWords[commandWords.length - 1]; // The last word is the target
}

const applyTemplates = (itemEvents: Types.Event[]) => {
    // Key: The condition type
    // Value: The meta key in the event object
    const conditionsMetaMap = {
        [CONDITION_IS_NOT_OPEN]: META_KEY_ON_OPEN_TEXT,
        [CONDITION_IS_NOT_CLOSED]: META_KEY_ON_CLOSED_TEXT,
        [CONDITION_IS_NOT_LOCKED]: META_KEY_ON_LOCKED_TEXT
    };

    return (itemEvents ?? []).map(event => {
        const templateEvent = templateEvents.find(template => template.action === event.action);
        if (templateEvent) {
            const e = { ...templateEvent, ...event };
            if (e.conditions) {
                e.conditions = e.conditions.map(condition => {
                    if (conditionsMetaMap[condition.type]) {
                        condition.meta = { ...condition.meta, text: e.meta[conditionsMetaMap[condition.type]] };
                    }
                    return condition;
                });
            }
            return e;
        }
        return event;
    });
}

const resolveCommand = (command: string): Types.Action => {
    if (!resolverInitialized) {
        throw new Error('Command resolver not initialized');
    }

    if (!command) {
        return null;
    }

    // This resolver only deals with events that are triggered by the player. For now.
    // The order of events is important here. Needs to figure out how to deal with conflicts between game events and built-in events.
    // Maybe we need to have a priority system for events, or a way to override events.

    // TODO: For each command we rebuild the list of events. This is not optimal. We should only do this once per room. But don't prematurely optimize!

    // Events tied to the room as a whole
    const roomEvents = ctx.currentRoom.events.filter(event => event.trigger === TRIGGER_COMMAND && event.scope === SCOPE_ROOM);

    // Events tied to items in the room
    const roomItemEvents = ctx.currentRoom.items.flatMap(item => (item.events ?? []));

    // Events tied to items in the inventory
    const inventoryItemEvents = ctx.inventory.getItems().flatMap(item => (item.events ?? []));

    // All events than can be triggered
    const events = globalEvents.filter(event => event.trigger === TRIGGER_COMMAND)
        .concat(roomEvents)
        .concat(applyTemplates(roomItemEvents))
        .concat(applyTemplates(inventoryItemEvents));

    // Try to find matching events using exact rule matching
    // First step is to find all events that have the exact rule in the mappings config
    const exactRuleEvents = events.filter(event => event.mappings && event.mappings.some(m => m.rule == MAPPINGS_RULE_EXACT && m.inputs.some(i => i === command)));

    // Find the target of the command
    const commandTargetWord = findTargetWord(command);
    const commandTarget = findByName(commandTargetWord);

    // HACK HACK HACK
    ctx.currentCommandTarget = commandTarget;

    // If we have exact rule events, we can return the first one
    if (exactRuleEvents.length > 1) {
        return buildErrorAction(`Multiple _exact_ matches found for command '${command}'. Please report this as a bug to the game developer.`);
    }

    if (exactRuleEvents.length === 1) {
        return buildActionForEvent(exactRuleEvents[0], command, commandTarget);
    }

    const commandWords = command.split(' ');
    if (!commandWords || commandWords.length === 0) {
        return null;
    }

    // Try to find matching events using "any" rule matching
    const anyRuleEvents = events
        .filter(event => event.mappings && event.mappings.some(m => m.rule == MAPPINGS_RULE_ANY && m.inputs.some(i => commandWords.some(cw => cw === i))))
        .filter(event => event.scope !== SCOPE_ITEM || (commandTarget && event.target && event.target === commandTarget.id) || !event.target);

    if (anyRuleEvents.length > 1) {
        return buildErrorAction(`Multiple _any_ matches found for command '${command}'. Please report this as a bug to the game developer.`);
    }

    if (anyRuleEvents.length === 1) {
        return buildActionForEvent(anyRuleEvents[0], command, commandTarget);
    }

    // Try to find matching events using "all" rule matching
    const allRuleEvents = events
        .filter(event => event.mappings && event.mappings.some(m => m.rule == MAPPINGS_RULE_ALL && m.inputs.every(i => commandWords.some(cw => cw === i))))
        .filter(event => event.scope !== SCOPE_ITEM || (commandTarget && event.target === commandTarget.id));

    if (allRuleEvents.length > 1) {
        return buildErrorAction(`Multiple _all_ matches found for command '${command}'. Please report this as a bug to the game developer.`);
    }

    if (allRuleEvents.length === 1) {
        return buildActionForEvent(allRuleEvents[0], command, commandTarget);
    }
}

export namespace CommandResolver {
    export const setup = setupCommandResolver;
    export const resolve = resolveCommand;
}