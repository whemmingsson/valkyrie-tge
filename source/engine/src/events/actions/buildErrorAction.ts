import output from "../../core/io/output.js";
import { ActionBuilder } from "../../types/actionBuilder.js";

export const buildErrorAction: ActionBuilder = (text) => {
    return {
        execute: () => output.error(text),
        type: "TEXT",
    }
}