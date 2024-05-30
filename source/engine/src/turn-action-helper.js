const turnActionHelper = {};
const C = require('./core/constants');

const turningMap = {
    [C.TURNING_DIRECTION_LEFT]: {
        [C.TURNING_DIRECTION_NORTH]: C.TURNING_DIRECTION_WEST,
        [C.TURNING_DIRECTION_WEST]: C.TURNING_DIRECTION_SOUTH,
        [C.TURNING_DIRECTION_SOUTH]: C.TURNING_DIRECTION_EAST,
        [C.TURNING_DIRECTION_EAST]: C.TURNING_DIRECTION_NORTH,
    },
    [C.TURNING_DIRECTION_RIGHT]: {
        [C.TURNING_DIRECTION_NORTH]: C.TURNING_DIRECTION_EAST,
        [C.TURNING_DIRECTION_EAST]: C.TURNING_DIRECTION_SOUTH,
        [C.TURNING_DIRECTION_SOUTH]: C.TURNING_DIRECTION_WEST,
        [C.TURNING_DIRECTION_WEST]: C.TURNING_DIRECTION_NORTH,
    }
}

turnActionHelper.findNextDirection = (_, command, currentDirection) => {
    // TODO: All of this should be customizable in the game config - to enable games in other languages - or games with different directions

    const commandWords = command.split(' ').map((word) => word.toUpperCase());
    const turnDirection = commandWords.find((word) => C.directions.includes(word));

    if (turnDirection) {
        return turnDirection;
    }

    if (commandWords.includes(C.TURNING_DIRECTION_LEFT) || commandWords.includes(C.TURNING_DIRECTION_RIGHT)) {
        return turningMap[commandWords.includes(C.TURNING_DIRECTION_LEFT) ? C.TURNING_DIRECTION_LEFT : C.TURNING_DIRECTION_RIGHT][currentDirection];
    }

    return null;
}

module.exports = turnActionHelper;