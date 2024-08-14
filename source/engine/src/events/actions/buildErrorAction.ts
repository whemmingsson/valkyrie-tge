import output from "../../core/io/output.js";
import Types from "../../types/types.js";

export const buildErrorAction: Types.ActionBuilder = (text) => {
    return {
        execute: () => output.error(text),
        type: "TEXT",
    }
}