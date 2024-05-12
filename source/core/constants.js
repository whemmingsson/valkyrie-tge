const constants = {}

// Event scopes
constants.EVENT_SCOPE_GLOBAL = "GLOBAL";
constants.EVENT_SCOPE_ROOM = "ROOM";

// Event actions types
constants.EVENT_ACTION_TEXT = "TEXT";

// Event trigger types
constants.EVENT_TRIGGER_COMMAND = "COMMAND";
constants.EVENT_TRIGGER_ENTER = "ENTER";

// Event conditions types
constants.EVENT_CONDITIONS_ROOM_VISIT_COUNT = "ROOM_VISIT_COUNT";

// Event mappings rules
constants.EVENT_MAPPINGS_RULE_EXACT = "EXACT";
constants.EVENT_MAPPINGS_RULE_ALL = "ALL";
constants.EVENT_MAPPINGS_RULE_ANY = "ANY";

module.exports = constants;