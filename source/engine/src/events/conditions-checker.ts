
import C from '../core/constants.js'
import Container from '../core/models/container.js';
import gameContext from '../state/game-context.js';

const ctx = gameContext.ctx;

type ConditionFunc = (conditions: any, target?: any) => any;

// Map of condition types to functions
const conditionsMap: { [key: string]: ConditionFunc } = {
    [C.EVENT_CONDITIONS_IS_NOT_LOCKED]: (conditions, target) => {
        if (target && target.isLocked) {
            return conditions;
        }
    },
    [C.EVENT_CONDITIONS_IS_NOT_OPEN]: (conditions, target) => {
        if (target && target.isOpen) {
            return conditions;
        }
    },
    [C.TEXT_CONDITION_ITEM_NOT_IN_INVENTORY]: (conditions, _) => {
        if (ctx.inventory.hasItemWithId(conditions.meta.itemid)) {
            return conditions;
        }
    },
    [C.EVENT_CONDITIONS_HAVE_KEY]: (conditions, target: Container) => {
        if (!ctx.inventory.hasItemWithId(target.keyId)) {
            return conditions;
        }
    },
    [C.EVENT_CONDITIONS_IS_LOCKED]: (conditions, target) => {
        if (!target.isLocked) {
            return conditions;
        }
    }
};

// Returns first failed condition
const checkConditions = (conditions: any, target?: any) => {
    if (!conditions) { return null; }

    for (let i = 0; i < conditions.length; i++) {
        const c = conditions[i];
        const conditionFunc = conditionsMap[c.type];

        if (!conditionFunc)
            continue;

        const failedCondition = conditionFunc(c, target);
        if (failedCondition) {
            return failedCondition;
        }

    }

    return null;
};

export default checkConditions;