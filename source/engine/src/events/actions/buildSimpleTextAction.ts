import { TextHelper } from "../../helpers/text-helper.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";
import { ACTION_TEXT } from "../../core/constants/events/actionTypes.js";

export const buildSimpleTextAction: ActionBuilder = (text: string | string[]) => {
    return {
        execute: () => TextHelper.logText(text),
        type: ACTION_TEXT
    }
}