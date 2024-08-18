import Container from "../../core/models/container.js";
import { TextHelper } from "../../helpers/text-helper.js";
import { Translation } from "../../helpers/translations.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";
import { GameEvent } from "../../core/types/event.js";
import { buildWarningAction } from "./buildWarningAction.js";

export const buildUnlockAction: ActionBuilder = (event: GameEvent, _, targetObject: Container) => {
    if (!targetObject) {
        return buildWarningAction(Translation.translate(Translation.ACTION_UNLOCK_NO_TARGET_WARNING));
    }

    if (targetObject && targetObject.isLocked) {
        return {
            execute: () => {
                targetObject.unlock();
                TextHelper.logText(event.meta.text);
            },
            type: "UNLOCK",
        }
    }

    return buildWarningAction(Translation.translate(Translation.ACTION_UNLOCK_TARGET_UNLOCKED_WARNING));
};