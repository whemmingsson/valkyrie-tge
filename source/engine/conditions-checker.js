const C = require('../core/constants');

const conditionsChecker = {};

conditionsChecker.check = (conditions, target) => {
    if (!conditions) { return null; }

    if (!target) {

    }

    for (let c of conditions) {
        if (c.type === C.EVENT_CONDITIONS_IS_NOT_LOCKED) {
            if (target.locked) {
                return c;
            }
        }

        if (c.type === C.EVENT_CONDITIONS_IS_NOT_OPEN) {
            if (target.open) {
                return c;
            }
        }
    }

    return null;
};


module.exports = conditionsChecker;