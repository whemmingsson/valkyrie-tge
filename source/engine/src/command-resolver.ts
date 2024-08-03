import C from './core/constants.js';
import actionBuilder from './action-builder.js';
import finder from './object-finder.js';
import builtInEvents from './game-events.js';
import Context from './game-context.js';
import GameTypes from './types/types.js';

interface CommandResolver {
    globalEvents: any[];
    templateEvents: any[];
}

const ctx = Context.ctx;

class CommandResolver {
    constructor(game) {
        this.templateEvents = builtInEvents.templates;
        this.globalEvents = game.events.filter(event => event.scope === C.EVENT_SCOPE_GLOBAL).concat(builtInEvents.all);
    }

    // This function will be used to find the target of a command - the target can be a room, an item, a character, etc.
    findTargetWord(command: String) {
        const commandWords = command.split(' ');
        if (!commandWords || commandWords.length < 2) {
            return null;
        }

        return commandWords[commandWords.length - 1]; // The last word is the target
    }

    applyTemplates(itemEvents: GameTypes.Event[]) {

        // Key: The condition type
        // Value: The meta key in the event object
        const conditionsMetaMap = {
            [C.EVENT_CONDITIONS_IS_NOT_OPEN]: C.META_KEY_ON_OPEN_TEXT,
            [C.EVENT_CONDITIONS_IS_NOT_CLOSED]: C.META_KEY_ON_CLOSED_TEXT,
            [C.EVENT_CONDITIONS_IS_NOT_LOCKED]: C.META_KEY_ON_LOCKED_TEXT
        };

        return itemEvents.map(event => {
            const templateEvent = this.templateEvents.find(template => template.action === event.action);
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

    resolve(command: string): (() => void) | (() => () => void) {
        if (!command) {
            return null;
        }

        // This resolver only deals with events that are triggered by the player. For now.
        // The order of events is important here. Needs to figure out how to deal with conflicts between game events and built-in events.
        // Maybe we need to have a priority system for events, or a way to override events.

        // TODO: For each command we rebuild the list of events. This is not optimal. We should only do this once per room.

        // Events tied to the room as a whole
        const roomEvents = ctx.currentRoom.events.filter(event => event.trigger === C.EVENT_TRIGGER_COMMAND && event.scope === C.EVENT_SCOPE_ROOM);

        // Events tied to items in the room
        const roomItemEvents = ctx.currentRoom.items.flatMap(item => (item.events ?? []));

        // All events than can be triggered
        const events = this.globalEvents.filter(event => event.trigger === C.EVENT_TRIGGER_COMMAND)
            .concat(roomEvents)
            .concat(this.applyTemplates(roomItemEvents));

        // Try to find matching events using exact rule matching
        // First step is to find all events that have the exact rule in the mappings config
        const exactRuleEvents = events.filter(event => event.mappings && event.mappings.some(m => m.rule == C.EVENT_MAPPINGS_RULE_EXACT && m.inputs.some(i => i === command)));

        // Find the target of the command
        // TODO: Does this belong here?
        const commandTargetWord = this.findTargetWord(command);
        const commandTarget = finder.find(commandTargetWord);

        // If we have exact rule events, we can return the first one
        if (exactRuleEvents.length > 1) {
            return actionBuilder.buildWarningAction(`Multiple _exact_ matches found for command '${command}'. Please report this as a bug to the game developer.`);
        }

        if (exactRuleEvents.length === 1) {
            return actionBuilder.buildActionForEvent(exactRuleEvents[0], command, commandTarget);
        }

        const commandWords = command.split(' ');
        if (!commandWords || commandWords.length === 0) {
            return null;
        }

        // Try to find matching events using "any" rule matching
        const anyRuleEvents = events
            .filter(event => event.mappings && event.mappings.some(m => m.rule == C.EVENT_MAPPINGS_RULE_ANY && m.inputs.some(i => commandWords.some(cw => cw === i))))
            .filter(event => event.scope !== C.EVENT_SCOPE_ITEM || (commandTarget && event.target && event.target === commandTarget.id) || !event.target);

        if (anyRuleEvents.length > 1) {
            return actionBuilder.buildWarningAction(`Multiple _any_ matches found for command '${command}'. Please report this as a bug to the game developer.`);
        }

        if (anyRuleEvents.length === 1) {
            return actionBuilder.buildActionForEvent(anyRuleEvents[0], command, commandTarget);
        }

        // Try to find matching events using "all" rule matching
        const allRuleEvents = events
            .filter(event => event.mappings && event.mappings.some(m => m.rule == C.EVENT_MAPPINGS_RULE_ALL && m.inputs.every(i => commandWords.some(cw => cw === i))))
            .filter(event => event.scope !== C.EVENT_SCOPE_ITEM || (commandTarget && event.target === commandTarget.id));

        if (allRuleEvents.length > 1) {
            return actionBuilder.buildWarningAction(`Multiple _all_ matches found for command '${command}'. Please report this as a bug to the game developer.`);
        }

        if (allRuleEvents.length === 1) {
            return actionBuilder.buildActionForEvent(allRuleEvents[0], command, commandTarget);
        }
    }
}

export default CommandResolver;