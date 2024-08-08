import { TextHelper } from "../../helpers/text-helper";
import Types from "../../types/types";

export const buildSimpleTextAction: Types.ActionBuilder = (text: string | string[]) => {
    return {
        execute: () => TextHelper.logText(text),
        type: "TEXT"
    }
}