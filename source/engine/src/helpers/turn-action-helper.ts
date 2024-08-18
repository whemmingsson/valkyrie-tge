import C from '../core/constants.js';
import { TURNING_DIRECTION_LEFT, TURNING_DIRECTION_NORTH, TURNING_DIRECTION_WEST, TURNING_DIRECTION_SOUTH, TURNING_DIRECTION_EAST, TURNING_DIRECTION_RIGHT } from '../core/constants/turningDirections.js';

const turningMap = {
    [TURNING_DIRECTION_LEFT]: {
        [TURNING_DIRECTION_NORTH]: TURNING_DIRECTION_WEST,
        [TURNING_DIRECTION_WEST]: TURNING_DIRECTION_SOUTH,
        [TURNING_DIRECTION_SOUTH]: TURNING_DIRECTION_EAST,
        [TURNING_DIRECTION_EAST]: TURNING_DIRECTION_NORTH,
    },
    [TURNING_DIRECTION_RIGHT]: {
        [TURNING_DIRECTION_NORTH]: TURNING_DIRECTION_EAST,
        [TURNING_DIRECTION_EAST]: TURNING_DIRECTION_SOUTH,
        [TURNING_DIRECTION_SOUTH]: TURNING_DIRECTION_WEST,
        [TURNING_DIRECTION_WEST]: TURNING_DIRECTION_NORTH,
    }
}

const turnActionHelper = {
    findNextDirection: (_, command, currentDirection) => {
        // TODO: All of this should be customizable in the game config - to enable games in other languages - or games with different directions

        const commandWords = command.split(' ').map((word) => word.toUpperCase());
        const turnDirection = commandWords.find((word) => C.directions.includes(word));

        if (turnDirection) {
            return turnDirection;
        }

        if (commandWords.includes(TURNING_DIRECTION_LEFT) || commandWords.includes(TURNING_DIRECTION_RIGHT)) {
            return turningMap[commandWords.includes(TURNING_DIRECTION_LEFT) ? TURNING_DIRECTION_LEFT : TURNING_DIRECTION_RIGHT][currentDirection];
        }

        return null;
    }
}

export default turnActionHelper;