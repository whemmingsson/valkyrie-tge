import { TextHelper } from "../../helpers/text-helper.js";
import Types from "../../types/types.js";

export const buildSimpleTextAction: Types.ActionBuilder = (text: string | string[]) => {
    return {
        execute: () => TextHelper.logText(text),
        type: "TEXT"
    }
}