import GameEvents from './types/types'
import C from './core/constants.js'

// Built in events that all games can hook into.
// The initial idea was to have a set of built-in events that all games can use. These events should be customizable by the game developer.

const events = {
    // Debugging event - displays debugging information
    DEBUG: {
        trigger: C.EVENT_TRIGGER_COMMAND,
        action: C.EVENT_ACTION_DEBUG,
        meta: {
            text: "Debugging information: "
        },
        mappings: [{ inputs: ["debug"], rule: "EXACT" }],
    } as GameEvents.Event,

    // Annotates texts with formatting - for testing purposes
    ANNOTATE: {
        trigger: C.EVENT_TRIGGER_COMMAND,
        action: C.EVENT_ACTION_TEXT,
        meta: {
            text: "Annotating with <g>this</g> built-in text. Only for <r>testing</r> purposes."
        },
        mappings: [{ inputs: ["annotate", "a"], rule: "ANY" }],
    } as GameEvents.Event,

    // Inventory event - displays the player's inventory
    INVENTORY: {
        trigger: C.EVENT_TRIGGER_COMMAND,
        action: C.EVENT_ACTION_INVENTORY,
        meta: {
            text: "Inventory: "
        },
        // These mappings needs to be customizable by the game developer - they should be in the game file
        mappings: [{ inputs: ["inventory", "show inventory", "inv", "open inventory", "list inventory contents", "list inventory"], rule: "EXACT" }],
    } as GameEvents.Event,

    // Turn event - turns the player in a direction
    TURN: {
        trigger: C.EVENT_TRIGGER_COMMAND,
        action: C.EVENT_ACTION_TURN,
        // These mappings needs to be customizable by the game developer - they should be in the game file
        mappings: [{ inputs: ["turn", "face"], rule: "ANY" }],
    } as GameEvents.Event,

    // Open event - opens an object (container, door, etc.)
    OPEN: {
        scope: C.EVENT_SCOPE_ITEM,
        trigger: C.EVENT_TRIGGER_COMMAND,
        action: C.EVENT_ACTION_OPEN,
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
    } as GameEvents.Event,

    // Describe event - describes an object by using the "describe" or "inspect" command. Displayes the object's description.
    DESCRIBE: {
        trigger: C.EVENT_TRIGGER_COMMAND,
        action: C.EVENT_ACTION_DESCRIBE,
        // These mappings needs to be customizable by the game developer - they should be in the game file
        mappings: [{ inputs: ["describe", "inspect"], rule: "ANY" }],
    } as GameEvents.Event,

} as GameEvents.Events;

// All bulit-in events (legacy)
events.all_legacy = [events.DEBUG, events.INVENTORY, events.TURN, events.OPEN, events.DESCRIBE];

// All bulit-in events 
events.all = [events.DEBUG, events.INVENTORY, events.TURN, events.DESCRIBE, events.ANNOTATE];

// Events that can be merged with the game's events
events.templates = [events.OPEN /*, events.DESCRIBE, events.TURN */];

// Global events that are always available - regardless of the game
events.global = [events.DEBUG, events.INVENTORY];

export default events;