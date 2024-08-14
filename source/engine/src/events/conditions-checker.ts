
import C from '../core/constants.js'
import { CONDITION_HAVE_KEY, CONDITION_IS_LOCKED, CONDITION_IS_NOT_LOCKED, CONDITION_IS_NOT_OPEN, CONDITION_ITEM_IN_INVENTORY, CONDITION_ROOM_VISIT_COUNT } from '../core/constants/events/conditionTypes.js';
import Container from '../core/models/container.js';
import gameContext from '../state/game-context.js';

type ConditionFunc = (conditions?: any, target?: any) => boolean;

// Map of condition types to functions
const conditionsMap: { [key: string]: ConditionFunc } = {
    [CONDITION_IS_NOT_LOCKED]: (_, target) => target && target.isLocked,
    [CONDITION_IS_NOT_OPEN]: (_, target) => target && target.isOpen,
    [C.TEXT_CONDITION_ITEM_NOT_IN_INVENTORY]: (c, _) => gameContext.ctx.inventory.hasItemWithId(c.meta.itemid),
    [CONDITION_ITEM_IN_INVENTORY]: (c, _) => !gameContext.ctx.inventory.hasItemWithId(c.meta.itemid),
    [CONDITION_HAVE_KEY]: (_, target: Container) => !gameContext.ctx.inventory.hasItemWithId(target.keyId),
    [CONDITION_IS_LOCKED]: (_, target) => !target.isLocked,
    [CONDITION_ROOM_VISIT_COUNT]: (c, _) => c.meta.operator === 'GT' && (gameContext.ctx.roomVisits[gameContext.ctx.currentRoom.id] || 0) !== parseInt(c.meta.value)
};

// Returns first failed condition
const checkConditions = (conditions: any, target?: any) => {
    if (!conditions) { return null; }

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