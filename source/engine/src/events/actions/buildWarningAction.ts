import output from "../../core/io/output.js";
import Types from "../../types/types.js";

export const buildWarningAction: Types.ActionBuilder = (text) => {
    return {
        execute: () => output.warn(text),
        type: "TEXT",
    }
}