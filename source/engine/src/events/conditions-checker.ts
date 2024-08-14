
import C from '../core/constants.js'
import { CONDITION_HAVE_KEY, CONDITION_IS_LOCKED, CONDITION_IS_NOT_LOCKED, CONDITION_IS_NOT_OPEN, CONDITION_ITEM_IN_INVENTORY, CONDITION_ROOM_VISIT_COUNT } from '../core/constants/events/conditionTypes.js';
import Container from '../core/models/container.js';
import gameContext from '../state/game-context.js';

const ctx = gameContext.ctx;

type ConditionFunc = (conditions: any, target?: any) => any;

// Map of condition types to functions
const conditionsMap: { [key: string]: ConditionFunc } = {
    [CONDITION_IS_NOT_LOCKED]: (conditions, target) => {
        if (target && target.isLocked) {
            return conditions;
        }
    },
    [CONDITION_IS_NOT_OPEN]: (conditions, target) => {
        if (target && target.isOpen) {
            return conditions;
        }
    },
    [C.TEXT_CONDITION_ITEM_NOT_IN_INVENTORY]: (conditions, _) => {
        if (ctx.inventory.hasItemWithId(conditions.meta.itemid)) {
            return conditions;
        }
    },

    [CONDITION_ITEM_IN_INVENTORY]: (conditions, _) => {
        if (!ctx.inventory.hasItemWithId(conditions.meta.itemid)) {
            return conditions;
        }
    },
    [CONDITION_HAVE_KEY]: (conditions, target: Container) => {
        if (!ctx.inventory.hasItemWithId(target.keyId)) {
            return conditions;
        }
    },
    [CONDITION_IS_LOCKED]: (conditions, target) => {
        if (!target.isLocked) {
            return conditions;
        }
    },
    [CONDITION_ROOM_VISIT_COUNT]: (conditions, _) => {
        const op = conditions.meta.operator;
        const visits = ctx.roomVisits[ctx.currentRoom['id']] || 0;
        if (op === 'EQ' && visits !== parseInt(conditions.meta.value)) {
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