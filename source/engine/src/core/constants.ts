import { TRIGGER_TURN_EAST, TRIGGER_TURN_WEST, TRIGGER_TURN_NORTH, TRIGGER_TURN_SOUTH } from "./constants/events/triggerTypes.js";
import { TURNING_DIRECTION_EAST, TURNING_DIRECTION_NORTH, TURNING_DIRECTION_SOUTH, TURNING_DIRECTION_WEST } from "./constants/turningDirections.js";

interface Constants {
    directions: string[];
    turnTriggers: string[];
}

const constants = {} as Constants;

// Groups
constants.directions = [TURNING_DIRECTION_NORTH, TURNING_DIRECTION_EAST, TURNING_DIRECTION_SOUTH, TURNING_DIRECTION_WEST];
constants.turnTriggers = [TRIGGER_TURN_EAST, TRIGGER_TURN_WEST, TRIGGER_TURN_NORTH, TRIGGER_TURN_SOUTH];

export default constants;