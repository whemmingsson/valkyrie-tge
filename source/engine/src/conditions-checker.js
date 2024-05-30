const C = require('./core/constants');

const conditionsChecker = {};

conditionsChecker.check = (conditions, target) => {
    if (!conditions) { return null; }

    if (!target) {

    }

    for (let i = 0; i < conditions.length; i++) {
        const c = conditions[i];
        if (c.type === C.EVENT_CONDITIONS_IS_NOT_LOCKED) {
            if (target && target.isLocked) {
                return c;
            }
        }

        if (c.type === C.EVENT_CONDITIONS_IS_NOT_OPEN) {
            if (target && target.isOpen) {
                return c;
            }
        }
    }

    return null;
};


module.exports = conditionsChecker;