const constants = {}

// Event scopes
constants.EVENT_SCOPE_GLOBAL = "GLOBAL";
constants.EVENT_SCOPE_ROOM = "ROOM";

// Event actions types
constants.EVENT_ACTION_TEXT = "TEXT";
constants.EVENT_ACTION_DEBUG = "DEBUG";
constants.EVENT_ACTION_INVENTORY = "INVENTORY";
constants.EVENT_ACTION_PLACE_IN_INVENTORY = "PLACE_INVENTORY";
constants.EVENT_ACTION_OPEN = "OPEN";
constants.EVENT_ACTION_TURN = "TURN";
constants.EVENT_ACTION_DESCRIBE = "DESCRIBE";

// Event trigger types
constants.EVENT_TRIGGER_COMMAND = "COMMAND";
constants.EVENT_TRIGGER_ENTER = "ENTER";
constants.EVENT_TRIGGER_OPEN = "OPEN";

// Event trigger types (turning)
constants.EVENT_TRIGGER_TURN_EAST = "TURN_EAST";
constants.EVENT_TRIGGER_TURN_WEST = "TURN_WEST";
constants.EVENT_TRIGGER_TURN_NORTH = "TURN_NORTH";
constants.EVENT_TRIGGER_TURN_SOUTH = "TURN_SOUTH";

// Event conditions types
constants.EVENT_CONDITIONS_ROOM_VISIT_COUNT = "ROOM_VISIT_COUNT";
constants.EVENT_CONDITIONS_IS_NOT_LOCKED = "IS_NOT_LOCKED";
constants.EVENT_CONDITIONS_IS_NOT_OPEN = "IS_NOT_OPEN";

// Event mappings rules
constants.EVENT_MAPPINGS_RULE_EXACT = "EXACT";
constants.EVENT_MAPPINGS_RULE_ALL = "ALL";
constants.EVENT_MAPPINGS_RULE_ANY = "ANY";

// Turning directions
constants.TURNING_DIRECTION_LEFT = "LEFT";
constants.TURNING_DIRECTION_RIGHT = "RIGHT";
constants.TURNING_DIRECTION_NORTH = "NORTH";
constants.TURNING_DIRECTION_EAST = "EAST";
constants.TURNING_DIRECTION_SOUTH = "SOUTH";
constants.TURNING_DIRECTION_WEST = "WEST";

// Item types
constants.ITEM_TYPE_CONTAINER = "CONTAINER";
constants.ITEM_TYPE_KEY = "KEY";

// Groups
constants.directions = [constants.TURNING_DIRECTION_NORTH, constants.TURNING_DIRECTION_EAST, constants.TURNING_DIRECTION_SOUTH, constants.TURNING_DIRECTION_WEST];
constants.turnTriggers = [constants.EVENT_TRIGGER_TURN_EAST, constants.EVENT_TRIGGER_TURN_WEST, constants.EVENT_TRIGGER_TURN_NORTH, constants.EVENT_TRIGGER_TURN_SOUTH];
constants.itemTypes = [constants.ITEM_TYPE_CONTAINER, constants.ITEM_TYPE_KEY];

export default constants;