import output from "../../core/io/output.js";
import Types from "../../types/types.js";

export const buildFormattedTextAction: Types.ActionBuilder = (template, text) => {
    return {
        execute: () => output.logWithTemplate(template, text),
        type: "TEXT",
    }
}