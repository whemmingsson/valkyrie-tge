
import Debug from '../debug.js'
import { ACTION_DEBUG, ACTION_TEXT, ACTION_INVENTORY, ACTION_OPEN, ACTION_DESCRIBE, ACTION_PICK_UP, ACTION_UNLOCK } from '../core/constants/events/actionTypes.js';
import { MAPPINGS_RULE_EXACT, MAPPINGS_RULE_ANY, MAPPINGS_RULE_ALL } from '../core/constants/events/mappingRules.js';
import { SCOPE_GLOBAL, SCOPE_ITEM } from '../core/constants/events/scopes.js';
import { TRIGGER_COMMAND } from '../core/constants/events/triggerTypes.js';
import { GameEvent } from '../core/types/event.js';
import { Events } from '../core/types/events.js';

// Built in events that all games can hook into.
// The initial idea was to have a set of built-in events that all games can use. These events should be customizable by the game developer.

const events = {
    // Debugging event - displays debugging information
    DEBUG: {
        trigger: TRIGGER_COMMAND,
        action: ACTION_DEBUG,
        meta: {
            text: "Debugging information: "
        },
        mappings: [{ inputs: ["debug"], rule: MAPPINGS_RULE_EXACT }],
    } as GameEvent,

    // Annotates texts with formatting - for testing purposes
    ANNOTATE: {
        trigger: TRIGGER_COMMAND,
        action: ACTION_TEXT,
        meta: {
            text: "Annotating with <g>this</g> built-in text. Only for <r>testing</r> purposes."
        },
        mappings: [{ inputs: ["annotate", "a"], rule: MAPPINGS_RULE_ANY }],
    } as GameEvent,

    // Inventory event - displays the player's inventory
    INVENTORY: {
        trigger: TRIGGER_COMMAND,
        action: ACTION_INVENTORY,
        meta: {
            text: "Inventory: "
        },
        // These mappings needs to be customizable by the game developer - they should be in the game file
        mappings: [{ inputs: ["inventory", "show inventory", "inv", "open inventory", "list inventory contents", "list inventory"], rule: MAPPINGS_RULE_EXACT }],
    } as GameEvent,

    // Open event - opens an object (container, door, et)
    OPEN: {
        scope: SCOPE_ITEM,
        trigger: TRIGGER_COMMAND,
        action: ACTION_OPEN,
        conditions: [
            {
                type: "IS_NOT_LOCKED", // This is a condition that checks if the object is unlocked
                meta: {
                    fallback_text: "The $ is locked."
                }
            },
            {
                type: "IS_NOT_OPEN", // This is a condition that checks if the object is already open
                meta: {
                    fallback_text: "The $ is already open."
                }
            }
        ],
        meta: {
            fallback_text: "You open the $. [event from game-events.ts]"
        }
    } as GameEvent,

    // Describe event - describes an object by using the "describe" or "inspect" command. Displayes the object's description.
    DESCRIBE: {
        scope: SCOPE_GLOBAL,
        trigger: TRIGGER_COMMAND,
        action: ACTION_DESCRIBE,
    } as GameEvent,

    // Pickup event - picks up an object
    PICKUP: {
        trigger: TRIGGER_COMMAND,
        action: ACTION_PICK_UP,
        // These mappings needs to be customizable by the game developer - they should be in the game file
        mappings: [{ inputs: ["pick up", "take", "grab"], rule: MAPPINGS_RULE_ANY }, { inputs: ["pick", "up"], rule: MAPPINGS_RULE_ALL }],
    } as GameEvent,

    UNLOCK: {
        trigger: TRIGGER_COMMAND,
        action: ACTION_UNLOCK,
        conditions: [
            {
                type: "IS_LOCKED", // This is a condition that checks if the object is unlocked
                meta: {
                    fallback_text: "The $ is already unlocked."
                }
            },
            {
                type: "HAVE_KEY", // This is a condition that checks if the player has the key
                meta: {
                    fallback_text: "You don't have the key to unlock the $."
                }
            }
        ],
        meta: {
            fallback_text: "You unlock the $."
        }
    } as GameEvent

} as Events;

// All bulit-in events 
events.all = [events.INVENTORY, events.PICKUP];

// Events that can be merged with the game's events
events.templates = [events.OPEN, events.DESCRIBE, /*events.TURN */ events.UNLOCK];

// Global events that are always available - regardless of the game
events.global = [events.INVENTORY];

if (Debug.DEBUG_MODE) {
    events.all.push(events.ANNOTATE);
    events.all.push(events.DEBUG);
    events.global.push(events.DEBUG);
}

export default events;