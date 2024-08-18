import { ActionBuilder } from "../../core/types/actionBuilder.js";
import context from '../../state/game-context.js';

export const buildInventoryAction: ActionBuilder = () => {
    return {
        execute: () => context.ctx.inventory.print(),
        type: "INVENTORY",
    }
}