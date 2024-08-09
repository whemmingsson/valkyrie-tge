import { TextHelper } from "../../helpers/text-helper.js";
import { Translation } from "../../helpers/translations.js";
import Types from "../../types/types.js";
import { buildWarningAction } from "./buildWarningAction.js";

export const buildUnlockAction: Types.ActionBuilder = (event, _, targetObject) => {
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