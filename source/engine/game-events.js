// Built in events that all games can hook into.
const events = {};

// Event that shows debugging information
events.DEBUG = {
    trigger: "COMMAND",
    action: "DEBUG",
    meta: {
        text: "Debugging information: "
    },
    mappings: [{ inputs: ["debug"], rule: "EXACT" }],
}

// Event that shows the inventory
events.INVENTORY = {
    trigger: "COMMAND",
    action: "INVENTORY",
    meta: {
        text: "Inventory: "
    },
    mappings: [{ inputs: ["inventory", "show inventory", "inv", "open inventory", "list inventory contents"], rule: "EXACT" }],
}

events.all = [events.DEBUG, events.INVENTORY];

module.exports = events;