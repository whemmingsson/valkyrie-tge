import TakeableObject from "../../core/models/takeableObject.js";
import { TextHelper } from "../../helpers/text-helper.js";
import { Translation } from "../../helpers/translations.js";
import gameContext from "../../state/game-context.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";
import { GameEvent } from "../../core/types/event.js";
import { buildWarningAction } from "./buildWarningAction.js";
import { registerBuilder } from "./actionRegistry.js";
import { ACTION_DELETE_ITEM_INVENTORY } from "../../core/constants/events/actionTypes.js";

export const buildDeleteItemInventoryAction: ActionBuilder = (event: GameEvent, __, targetObject: TakeableObject) => {
    if (!targetObject) {
        return buildWarningAction(Translation.translate(Translation.ACTION_DELETE_ITEM_INVENTORY_NO_TARGET_WARNING));
    }

    if (!gameContext.ctx.inventory.hasItem(targetObject)) {
        return buildWarningAction(Translation.translate(Translation.ACTION_DELETE_ITEM_INVENTORY_NO_TARGET_WARNING));
    }

    return {
        execute: () => {
            gameContext.ctx.inventory.removeItem(targetObject);
            if (event.meta.text) {
                TextHelper.logText(event.meta.text);
            }
        },
        type: ACTION_DELETE_ITEM_INVENTORY
    }
}

registerBuilder(ACTION_DELETE_ITEM_INVENTORY, buildDeleteItemInventoryAction);