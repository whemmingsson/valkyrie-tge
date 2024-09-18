import { buildActionForEvent } from './events/actionBuilder.js';
import builtInEvents from './events/game-events.js';
import { getContext } from './state/game-context.js';
import { buildErrorAction } from './events/actions/buildErrorAction.js';
import { CONDITION_IS_NOT_OPEN, CONDITION_IS_NOT_CLOSED, CONDITION_IS_NOT_LOCKED } from './core/constants/events/conditionTypes.js';
import { MAPPINGS_RULE_EXACT, MAPPINGS_RULE_ANY, MAPPINGS_RULE_ALL } from './core/constants/events/mappingRules.js';
import { SCOPE_ROOM, SCOPE_ITEM } from './core/constants/events/scopes.js';
import { TRIGGER_COMMAND } from './core/constants/events/triggerTypes.js';
import { META_KEY_ON_OPEN_TEXT, META_KEY_ON_CLOSED_TEXT, META_KEY_ON_LOCKED_TEXT } from './core/constants/metaKeys.js';
import { findByName } from './world/object-finder.js';
import { GameEvent } from './core/types/event.js';
import { Action } from './core/types/action.js';
import { EventRegistryMap } from './eventRegistry.js';

const findTargetWord = (command: String) => {
    const commandWords = command.split(' ');
    if (!commandWords || commandWords.length < 2) {
        return null;
    }

    return commandWords[commandWords.length - 1]; // The last word is the target
}

export class CommandResolver {
    templateEvents: GameEvent[];
    globalEvents: any;
    eventRegistry: EventRegistryMap;

    constructor(game) {
        this.templateEvents = builtInEvents.templates;
        this.globalEvents = (game.events ?? []);
        this.eventRegistry = {};
    }

    applyTemplates = (events: GameEvent[]) => {
        // Key: The condition type
        // Value: The meta key in the event object
        const conditionsMetaMap = {
            [CONDITION_IS_NOT_OPEN]: META_KEY_ON_OPEN_TEXT,
            [CONDITION_IS_NOT_CLOSED]: META_KEY_ON_CLOSED_TEXT,
            [CONDITION_IS_NOT_LOCKED]: META_KEY_ON_LOCKED_TEXT
        };

        return (events ?? []).map(event => {
            const templateEvent = this.templateEvents.find(template => template.action === event.action);
            if (templateEvent) {
                const mergedEvent = { ...templateEvent, ...event } as GameEvent;
                if (mergedEvent.conditions) {
                    mergedEvent.conditions = mergedEvent.conditions.map(condition => {
                        if (conditionsMetaMap[condition.type]) {
                            condition.meta = { ...condition.meta, text: mergedEvent.meta[conditionsMetaMap[condition.type]] };
                        }
                        return condition;
                    });
                }
                return mergedEvent;
            }
            return event;
        });
    }

    resolveCommand = (command: string): Action => {
        if (!command) {
            return null;
        }

        const ctx = getContext().ctx;

        let events: GameEvent[] = [];

        if (this.eventRegistry[ctx.currentRoom.id]) {
            events = this.eventRegistry[ctx.currentRoom.id];
        }
        else {
            const roomEvents = ctx.currentRoom.events.filter(event => event.trigger === TRIGGER_COMMAND && event.scope === SCOPE_ROOM);
            const roomItemEvents = ctx.currentRoom.items.flatMap(item => (item.events ?? []));
            const roomDoorEvents = ctx.currentRoom.doors.flatMap(door => (door.events ?? []));
            const inventoryItemEvents = ctx.inventory.getItems().flatMap(item => (item.events ?? []));
            const allEvents = this.globalEvents.concat(roomEvents).concat(roomItemEvents).concat(roomDoorEvents).concat(inventoryItemEvents);
            events = this.applyTemplates(allEvents).concat(builtInEvents.all);
            this.eventRegistry[ctx.currentRoom.id] = events;
        }

        // Try to find matching events using exact rule matching
        // First step is to find all events that have the exact rule in the mappings config
        const exactRuleEvents = events.filter(event => event.mappings && event.mappings.some(m => m.rule == MAPPINGS_RULE_EXACT && m.inputs.some(i => i === command)));

        // Find the target of the command
        const commandTargetWord = findTargetWord(command);
        const commandTarget = findByName(commandTargetWord);

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
}
