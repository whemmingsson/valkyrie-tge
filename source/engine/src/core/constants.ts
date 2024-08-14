interface Constants {
    META_KEY_ON_CLOSED_TEXT: string;
    META_KEY_ON_LOCKED_TEXT: string;
    META_KEY_ON_OPEN_TEXT: string;
    EVENT_TRIGGER_TURN_EAST: string;
    EVENT_TRIGGER_TURN_WEST: string;
    EVENT_TRIGGER_TURN_NORTH: string;
    EVENT_TRIGGER_TURN_SOUTH: string;
    TURNING_DIRECTION_LEFT: string;
    TURNING_DIRECTION_RIGHT: string;
    TURNING_DIRECTION_NORTH: string;
    TURNING_DIRECTION_EAST: string;
    TURNING_DIRECTION_SOUTH: string;
    TURNING_DIRECTION_WEST: string;
    TEXT_CONDITION_ITEM_NOT_IN_INVENTORY: string;
    directions: string[];
    turnTriggers: string[];
}

const constants = {} as Constants;

// Event trigger types (turning)
constants.EVENT_TRIGGER_TURN_EAST = "TURN_EAST";
constants.EVENT_TRIGGER_TURN_WEST = "TURN_WEST";
constants.EVENT_TRIGGER_TURN_NORTH = "TURN_NORTH";
constants.EVENT_TRIGGER_TURN_SOUTH = "TURN_SOUTH";

// Text condition constants
constants.TEXT_CONDITION_ITEM_NOT_IN_INVENTORY = "ITEM_NOT_IN_INVENTORY";

// Turning directions
constants.TURNING_DIRECTION_LEFT = "LEFT";
constants.TURNING_DIRECTION_RIGHT = "RIGHT";
constants.TURNING_DIRECTION_NORTH = "NORTH";
constants.TURNING_DIRECTION_EAST = "EAST";
constants.TURNING_DIRECTION_SOUTH = "SOUTH";
constants.TURNING_DIRECTION_WEST = "WEST";

// Meta keys
constants.META_KEY_ON_OPEN_TEXT = "on_open_text";
constants.META_KEY_ON_CLOSED_TEXT = "on_closed_text";
constants.META_KEY_ON_LOCKED_TEXT = "on_locked_text";

// Groups
constants.directions = [constants.TURNING_DIRECTION_NORTH, constants.TURNING_DIRECTION_EAST, constants.TURNING_DIRECTION_SOUTH, constants.TURNING_DIRECTION_WEST];
constants.turnTriggers = [constants.EVENT_TRIGGER_TURN_EAST, constants.EVENT_TRIGGER_TURN_WEST, constants.EVENT_TRIGGER_TURN_NORTH, constants.EVENT_TRIGGER_TURN_SOUTH];

export default constants;