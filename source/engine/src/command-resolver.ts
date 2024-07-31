import C from './core/constants.js';
import actionBuilder from './action-builder.js';
import finder from './object-finder.js';
import builtInEvents from './game-events.js';
import Context from './game-context.js';

interface CommandResolver {
    events: any[];
    globalEvents: any[];
}

const ctx = Context.ctx;

class CommandResolver {
    constructor(game) {
        this.events = game.events;
        this.globalEvents = this.events.filter(event => event.scope === C.EVENT_SCOPE_GLOBAL).concat(builtInEvents.all);
    }

    // This function will be used to find the target of a command - the target can be a room, an item, a character, etc.
    findTargetWord(command: String) {
        // We need to make some assumptions here to get started.
        // Assume the command must be 2 words long, and the second word is the target.

        const commandWords = command.split(' ');
        if (!commandWords || commandWords.length < 2) {
            return null;
        }

        return commandWords[1];
    }

    resolve(command: string): (() => void) | (() => () => void) {
        if (!command) {
            return null;
        }

        // This resolver only deals with events that are triggered by player commands. For now.
        const roomEvents = ctx.currentRoom.events.filter(event => event.trigger === C.EVENT_TRIGGER_COMMAND && event.scope === C.EVENT_SCOPE_ROOM);
        const commandEvents = this.globalEvents.filter(event => event.trigger === C.EVENT_TRIGGER_COMMAND).concat(roomEvents);

        // Try to find matching events using exact rule matching
        // First step is to find all events that have the exact rule in the mappings config
        const exactRuleEvents = commandEvents.filter(event => event.mappings && event.mappings.some(m => m.rule == C.EVENT_MAPPINGS_RULE_EXACT && m.inputs.some(i => i === command)));

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
        const anyRuleEvents = commandEvents.filter(event => event.mappings && event.mappings.some(m => m.rule == C.EVENT_MAPPINGS_RULE_ANY && m.inputs.some(i => commandWords.some(cw => cw === i))));
        if (anyRuleEvents.length > 1) {
            return actionBuilder.buildWarningAction(`Multiple _any_ matches found for command '${command}'. Please report this as a bug to the game developer.`);
        }

        if (anyRuleEvents.length === 1) {
            return actionBuilder.buildActionForEvent(anyRuleEvents[0], command, commandTarget);
        }

        // Try to find matching events using "all" rule matching
        const allRuleEvents = commandEvents.filter(event => event.mappings && event.mappings.some(m => m.rule == C.EVENT_MAPPINGS_RULE_ALL && m.inputs.every(i => commandWords.some(cw => cw === i))));
        if (allRuleEvents.length > 1) {
            return actionBuilder.buildWarningAction(`Multiple _all_ matches found for command '${command}'. Please report this as a bug to the game developer.`);
        }

        if (allRuleEvents.length === 1) {
            return actionBuilder.buildActionForEvent(allRuleEvents[0], command, commandTarget);
        }
    }
}

export default CommandResolver;