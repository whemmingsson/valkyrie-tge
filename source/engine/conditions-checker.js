const C = require('../core/constants');
const context = require('./game-context').ctx;

const conditionsChecker = {};

conditionsChecker.check = (conditions, command, target) => {
    if (!conditions) { return null; }

    console.log('Checking conditions: ', conditions);
    console.log('Command: ', command);
    console.log('Target: ', target);

    for (let c of conditions) {
        if (c.type === C.EVENT_CONDITIONS_IS_NOT_LOCKED) {

        }

    }
};



module.exports = conditionsChecker;