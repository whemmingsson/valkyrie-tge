import logger from "../../core/io/logger.js";
import { Translation } from "../../helpers/translations.js";
import gameContext from "../../state/game-context.js";
import Types from "../../types/types.js";
import { buildWarningAction } from "./buildWarningAction.js";

export const buildPickupAction: Types.ActionBuilder = (_, __, targetObject) => {
    if (!targetObject) {
        return buildWarningAction(Translation.translate(Translation.ACTION_PICKUP_NO_TARGET_WARNING));
    }

    if (targetObject && !targetObject.visible) {
        return buildWarningAction(gameContext.ctx.inventory.hasItem(targetObject)
            ? Translation.translate(Translation.ACTION_PICKUP_NO_TARGET_IN_INVENTORY_WARNING)
            : Translation.translate(Translation.ACTION_PICKUP_NO_TARGET_WARNING));
    }

    return {
        execute: () => {
            gameContext.ctx.inventory.addItem(targetObject);
            targetObject.visible = false;
            targetObject.removeFromParent();
            gameContext.ctx.currentRoom.removeItem(targetObject);
            logger.logWithTemplate("You pick up the $.", [targetObject.name])

        },
        type: "PICKUP",
    }
}