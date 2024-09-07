import output from "../../core/io/output.js";
import Container from "../../core/models/container.js";
import { Features } from "../../core/features.js";
import { TextHelper } from "../../helpers/text-helper.js";
import { Translation } from "../../helpers/translations.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";
import { GameEvent } from "../../core/types/event.js";
import { buildNoopAction } from "./buildNoopAction.js";
import { buildWarningAction } from "./buildWarningAction.js";
import { registerBuilder } from "./actionRegistry.js";
import { ACTION_OPEN } from "../../core/constants/events/actionTypes.js";

export const buildOpenAction: ActionBuilder = (event: GameEvent, _, targetObject: Container) => {
    if (!targetObject) {
        return buildWarningAction(Translation.translate(Translation.ACTION_OPEN_NO_TARGET_WARNING), event);
    }

    const textAction = () => event.meta.text
        ? TextHelper.logText(event.meta.text)
        : output.logWithTemplate(event.meta.fallback_text, [targetObject.name]);


    if (!Features.ENABLE_AUTO_PICKUP) {
        return {
            execute: () => {
                targetObject.open();
                textAction();
            },
            type: ACTION_OPEN,
            target: targetObject,
        }
    }

    // TODO: Handle auto-pickup here

    // OLD CODE:
    /*// This logic is only for the auto-pickup feature
const itemsWithAutoPickup = targetObject.getItemsWithAutoPickup();
const secondaryAction = itemsWithAutoPickup.length > 0
    ? actionBuilder.buildPickupAction(_, _, itemsWithAutoPickup[0])
    : actionBuilder.buildNoopAction(event);

return wrapAction(() => { primaryAction(); return secondaryAction(); }); */

    return buildNoopAction();
}

registerBuilder(ACTION_OPEN, buildOpenAction);