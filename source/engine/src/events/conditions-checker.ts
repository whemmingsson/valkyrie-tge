
import { CONDITION_HAVE_KEY, CONDITION_IS_LOCKED, CONDITION_IS_NOT_LOCKED, CONDITION_IS_NOT_OPEN, CONDITION_ITEM_IN_INVENTORY, CONDITION_ROOM_VISIT_COUNT } from '../core/constants/events/conditionTypes.js';
import { TEXT_CONDITION_ITEM_NOT_IN_INVENTORY } from '../core/constants/events/textConditionTypes.js';
import Container from '../core/models/container.js';
import Ctx from '../state/ctx.js';
import { getContext } from '../state/game-context.js';

let ctx: Ctx;

type ConditionFunc = (conditions?: any, target?: any) => boolean;

// Map of condition types to functions
const conditionsMap: { [key: string]: ConditionFunc } = {
    [CONDITION_IS_NOT_LOCKED]: (_, target) => target && target.isLocked,
    [CONDITION_IS_NOT_OPEN]: (_, target) => target && target.isOpen,
    [TEXT_CONDITION_ITEM_NOT_IN_INVENTORY]: (c, _) => ctx.inventory.hasItemWithId(c.meta.itemid),
    [CONDITION_ITEM_IN_INVENTORY]: (c, _) => !ctx.inventory.hasItemWithId(c.meta.itemid),
    [CONDITION_HAVE_KEY]: (_, target: Container) => !ctx.inventory.hasItemWithId(target.keyId),
    [CONDITION_IS_LOCKED]: (_, target) => !target.isLocked,
    [CONDITION_ROOM_VISIT_COUNT]: (c, _) => c.meta.operator === 'GT' && (ctx.roomVisits[ctx.currentRoom.id] || 0) !== parseInt(c.meta.value)
};

// Returns first failed condition
const checkConditions = (conditions: any[], target?: any) => {
    if (!conditions) { return null; }

    ctx = getContext().ctx;

    for (let i = 0; i < conditions.length; i++) {
        const c = conditions[i];
        const conditionFunc = conditionsMap[c.type];

        if (!conditionFunc)
            continue;

        if (conditionFunc(c, target)) {
            return c;
        }
    }

    return null;
};

export default checkConditions;