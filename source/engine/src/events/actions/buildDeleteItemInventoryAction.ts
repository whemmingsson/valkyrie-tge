import TakeableObject from "../../core/models/takeableObject.js";
import { TextHelper } from "../../helpers/text-helper.js";
import { Translation } from "../../helpers/translations.js";
import gameContext from "../../state/game-context.js";
import { ActionBuilder } from "../../types/actionBuilder.js";
import { GameEvent } from "../../types/event.js";
import { buildWarningAction } from "./buildWarningAction.js";

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
        type: "DELETE_ITEM_INVENTORY"
    }
}