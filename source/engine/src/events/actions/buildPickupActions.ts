import output from "../../core/io/output.js";
import TakeableObject from "../../core/models/takeableObject.js";
import { Translation } from "../../helpers/translations.js";
import gameContext from "../../state/game-context.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";
import { buildWarningAction } from "./buildWarningAction.js";
import { registerBuilder } from "./actionRegistry.js";
import { ACTION_PICK_UP } from "../../core/constants/events/actionTypes.js";

export const buildPickupAction: ActionBuilder = (_, __, targetObject: TakeableObject) => {
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
            output.logWithTemplate("You pick up the $.", [targetObject.name])

        },
        type: ACTION_PICK_UP,
    }
}

registerBuilder(ACTION_PICK_UP, buildPickupAction);