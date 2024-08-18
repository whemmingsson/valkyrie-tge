import { TextHelper } from "../../helpers/text-helper.js";
import { ActionBuilder } from "../../types/actionBuilder.js";

export const buildSimpleTextAction: ActionBuilder = (text: string | string[]) => {
    return {
        execute: () => TextHelper.logText(text),
        type: "TEXT"
    }
}