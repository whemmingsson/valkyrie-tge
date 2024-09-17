import { ACTION_INVENTORY } from "../../core/constants/events/actionTypes.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";
import { getContext } from '../../state/game-context.js';
import { registerBuilder } from "./actionRegistry.js";



export const buildInventoryAction: ActionBuilder = () => {
    const ctx = getContext().ctx;
    return {
        execute: () => ctx.inventory.print(),
        type: ACTION_INVENTORY,
    }
}

registerBuilder(ACTION_INVENTORY, buildInventoryAction);