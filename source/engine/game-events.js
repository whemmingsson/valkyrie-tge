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
    // These mappings needs to be customizable by the game developer - they should be in the game file
    mappings: [{ inputs: ["inventory", "show inventory", "inv", "open inventory", "list inventory contents", "list inventory"], rule: "EXACT" }],
}

// Event that turns the player
events.TURN = {
    trigger: "COMMAND",
    action: "TURN",
    // These mappings needs to be customizable by the game developer - they should be in the game file
    mappings: [{ inputs: ["turn", "face"], rule: "ANY" }],
}

events.all = [events.DEBUG, events.INVENTORY, events.TURN];

module.exports = events;