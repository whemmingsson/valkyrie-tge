import { ACTION_INVENTORY } from "../../core/constants/events/actionTypes.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";
import context from '../../state/game-context.js';
import { registerBuilder } from "./actionRegistry.js";

export const buildInventoryAction: ActionBuilder = () => {
    return {
        execute: () => context.ctx.inventory.print(),
        type: ACTION_INVENTORY,
    }
}

registerBuilder(ACTION_INVENTORY, buildInventoryAction);