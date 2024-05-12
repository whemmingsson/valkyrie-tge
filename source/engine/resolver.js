const C = require('../core/constants');
const logger = require('../core/io/logger');

const buildTextAction = (text) => {
    return () => logger.log(text);
}

const buildWarningAction = (text) => {
    return () => logger.warn(text);
}

class CommandResolver {
    constructor(game) {
        // This only includes the global mappings
        // Mappings can also be defined at the room level
        // This in turn means that the current version of the game engine does not support room-specific mappings
        this.events = game.events;
        this.globalEvents = this.events.filter(event => event.scope === C.EVENT_SCOPE_GLOBAL);
    }

    handleAction(event) {
        switch (event.action) {
            case C.EVENT_ACTION_TEXT: return buildTextAction(event.meta.text);
        }
    }

    resolve(command) {
        if (!command) {
            return null;
        }

        // This resolver only deals with events that are triggered by player commands. For now.
        const commandEvents = this.globalEvents.filter(event => event.trigger === C.EVENT_TRIGGER_COMMAND);

        // Try to find matching events using exact rule matching
        // First step is to find all events that have the exact rule in the mappings config
        const exactRuleEvents = commandEvents.filter(event => event.mappings && event.mappings.some(m => m.rule == C.EVENT_MAPPINGS_RULE_EXACT && m.inputs.some(i => i === command)));

        // If we have exact rule events, we can return the first one
        if (exactRuleEvents.length > 1) {
            return buildWarningAction(`Multiple exact matches found for command '${command}' for scope '${C.EVENT_SCOPE_GLOBAL}'. Please report this as a bug to the game developer.`);
        }

        if (exactRuleEvents.length === 1) {
            return this.handleAction(exactRuleEvents[0]);
        }

        const commandWords = command.split(' ');
        if (!commandWords || commandWords.length === 0) {
            return null;
        }

        // Try to find matching events using "any" rule matching
        const anyRuleEvents = commandEvents.filter(event => event.mappings && event.mappings.some(m => m.rule == C.EVENT_MAPPINGS_RULE_ANY && m.inputs.some(i => commandWords.some(cw => cw === i))));
        if (anyRuleEvents.length > 1) {
            return buildWarningAction(`Multiple any matches found for command '${command}' for scope '${C.EVENT_SCOPE_GLOBAL}'. Please report this as a bug to the game developer.`);
        }

        if (anyRuleEvents.length === 1) {
            return this.handleAction(anyRuleEvents[0]);
        }
    }
}


module.exports = CommandResolver;