import { TextHelper } from "../../helpers/text-helper.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";

export const buildSimpleTextAction: ActionBuilder = (text: string | string[]) => {
    return {
        execute: () => TextHelper.logText(text),
        type: "TEXT"
    }
}