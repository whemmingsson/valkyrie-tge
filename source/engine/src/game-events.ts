import GameEvents from './types/types'

// Built in events that all games can hook into.
const events = {
    DEBUG: {
        trigger: "COMMAND",
        action: "DEBUG",
        meta: {
            text: "Debugging information: "
        },
        mappings: [{ inputs: ["debug"], rule: "EXACT" }],
     } as GameEvents.Event,

     INVENTORY: {
        trigger: "COMMAND",
        action: "INVENTORY",
        meta: {
            text: "Inventory: "
        },
        // These mappings needs to be customizable by the game developer - they should be in the game file
        mappings: [{ inputs: ["inventory", "show inventory", "inv", "open inventory", "list inventory contents", "list inventory"], rule: "EXACT" }],
    } as GameEvents.Event,

    TURN: {
        trigger: "COMMAND",
        action: "TURN",
        // These mappings needs to be customizable by the game developer - they should be in the game file
        mappings: [{ inputs: ["turn", "face"], rule: "ANY" }],
    } as GameEvents.Event,

    OPEN: {
        trigger: "COMMAND",
        action: "OPEN",
        conditions: [
            {
                type: "IS_NOT_LOCKED", // This is a condition that checks if the object is unlocked
                meta: {
                    text: "The $ is locked."
                }
            },
            {
                type: "IS_NOT_OPEN", // This is a condition that checks if the object is already open
                meta: {
                    text: "The $ is already open."
                }
            }
        ],
        // These mappings needs to be customizable by the game developer - they should be in the game file
        mappings: [{ inputs: ["open"], rule: "ANY" }],
        meta: {
            text: "You open the $."
        }
    } as GameEvents.Event,

    DESCRIBE: {
        trigger: "COMMAND",
        action: "DESCRIBE",
        // These mappings needs to be customizable by the game developer - they should be in the game file
        mappings: [{ inputs: ["describe", "inspect"], rule: "ANY" }],
    } as GameEvents.Event,

} as GameEvents.Events;

events.all = [events.DEBUG, events.INVENTORY, events.TURN, events.OPEN, events.DESCRIBE];

export default events;