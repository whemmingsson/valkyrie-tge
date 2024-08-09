import Types from "../../types/types.js";
import context from '../../state/game-context.js';

export const buildInventoryAction: Types.ActionBuilder = () => {
    return {
        execute: () => context.ctx.inventory.print(),
        type: "INVENTORY",
    }
}