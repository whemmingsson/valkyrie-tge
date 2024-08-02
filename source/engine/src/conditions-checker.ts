import C from './core/constants.js'
import gameContext from './game-context.js';
import objectFinder from './object-finder.js';

const ctx = gameContext.ctx;

const conditionsChecker = {
    check: (conditions: any, target?: any) => {
        if (!conditions) { return null; }

        if (!target) { }

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

            if (c.type === C.TEXT_CONDITION_ITEM_NOT_IN_INVENTORY) {
                const t = objectFinder.findById(c.meta.itemid);
                if (t && ctx.inventory.hasItem(t)) {
                    return c;
                }
            }
        }

        return null;
    }
};


export default conditionsChecker;