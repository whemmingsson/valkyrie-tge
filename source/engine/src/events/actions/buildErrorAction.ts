import output from "../../core/io/output.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";

export const buildErrorAction: ActionBuilder = (text: string) => {
    return {
        execute: () => output.error(text),
        type: "TEXT",
    }
}