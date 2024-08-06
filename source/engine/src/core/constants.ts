interface Constants {
    EVENT_ACTION_DELETE_ITEM_INVENTORY: string;
    TEXT_CONDITION_ITEM_NOT_IN_INVENTORY: string;
    ITEM_TYPE_GENERIC: string;
    META_KEY_ON_CLOSED_TEXT: string;
    META_KEY_ON_LOCKED_TEXT: string;
    META_KEY_ON_OPEN_TEXT: string;
    EVENT_SCOPE_GLOBAL: string;
    EVENT_SCOPE_ROOM: string;
    EVENT_SCOPE_ITEM: string;
    EVENT_ACTION_TEXT: string;
    EVENT_ACTION_DEBUG: string;
    EVENT_ACTION_INVENTORY: string;
    EVENT_ACTION_PICK_UP: string;
    EVENT_ACTION_OPEN: string;
    EVENT_ACTION_CLOSE: string;
    EVENT_ACTION_TURN: string;
    EVENT_ACTION_DESCRIBE: string;
    EVENT_TRIGGER_COMMAND: string;
    EVENT_TRIGGER_ENTER: string;
    EVENT_TRIGGER_OPEN: string;
    EVENT_TRIGGER_TURN_EAST: string;
    EVENT_TRIGGER_TURN_WEST: string;
    EVENT_TRIGGER_TURN_NORTH: string;
    EVENT_TRIGGER_TURN_SOUTH: string;
    EVENT_CONDITIONS_ROOM_VISIT_COUNT: string;
    EVENT_CONDITIONS_IS_NOT_LOCKED: string;
    EVENT_CONDITIONS_IS_NOT_OPEN: string;
    EVENT_CONDITIONS_IS_NOT_CLOSED: string;
    EVENT_MAPPINGS_RULE_EXACT: string;
    EVENT_MAPPINGS_RULE_ALL: string;
    EVENT_MAPPINGS_RULE_ANY: string;
    TURNING_DIRECTION_LEFT: string;
    TURNING_DIRECTION_RIGHT: string;
    TURNING_DIRECTION_NORTH: string;
    TURNING_DIRECTION_EAST: string;
    TURNING_DIRECTION_SOUTH: string;
    TURNING_DIRECTION_WEST: string;
    ITEM_TYPE_CONTAINER: string;
    ITEM_TYPE_KEY: string;
    directions: string[];
    turnTriggers: string[];
    itemTypes: string[];
}

const constants = {} as Constants;

// Event scopes
constants.EVENT_SCOPE_GLOBAL = "GLOBAL";
constants.EVENT_SCOPE_ROOM = "ROOM";
constants.EVENT_SCOPE_ITEM = "ITEM";

// Event actions types
constants.EVENT_ACTION_TEXT = "TEXT";
constants.EVENT_ACTION_DEBUG = "DEBUG";
constants.EVENT_ACTION_INVENTORY = "INVENTORY";
constants.EVENT_ACTION_PICK_UP = "PICKUP";
constants.EVENT_ACTION_OPEN = "OPEN";
constants.EVENT_ACTION_CLOSE = "CLOSE";
constants.EVENT_ACTION_TURN = "TURN";
constants.EVENT_ACTION_DESCRIBE = "DESCRIBE";
constants.EVENT_ACTION_DELETE_ITEM_INVENTORY = "DELETE_ITEM_INVENTORY";

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
constants.EVENT_CONDITIONS_IS_NOT_CLOSED = "IS_NOT_CLOSED";

// Text condition constants
constants.TEXT_CONDITION_ITEM_NOT_IN_INVENTORY = "ITEM_NOT_IN_INVENTORY";

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
constants.ITEM_TYPE_GENERIC = "GENERIC";
constants.ITEM_TYPE_CONTAINER = "CONTAINER";
constants.ITEM_TYPE_KEY = "KEY";

// Meta keys
constants.META_KEY_ON_OPEN_TEXT = "on_open_text";
constants.META_KEY_ON_CLOSED_TEXT = "on_closed_text";
constants.META_KEY_ON_LOCKED_TEXT = "on_locked_text";

// Groups
constants.directions = [constants.TURNING_DIRECTION_NORTH, constants.TURNING_DIRECTION_EAST, constants.TURNING_DIRECTION_SOUTH, constants.TURNING_DIRECTION_WEST];
constants.turnTriggers = [constants.EVENT_TRIGGER_TURN_EAST, constants.EVENT_TRIGGER_TURN_WEST, constants.EVENT_TRIGGER_TURN_NORTH, constants.EVENT_TRIGGER_TURN_SOUTH];
constants.itemTypes = [constants.ITEM_TYPE_CONTAINER, constants.ITEM_TYPE_KEY, constants.ITEM_TYPE_GENERIC];

export default constants;