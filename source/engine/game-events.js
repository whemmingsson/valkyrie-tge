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

events.all = [events.DEBUG];

module.exports = events;