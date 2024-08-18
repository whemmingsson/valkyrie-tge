import output from "../../core/io/output.js";
import { ActionBuilder } from "../../types/actionBuilder.js";

export const buildWarningAction: ActionBuilder = (text: string) => {
    return {
        execute: () => output.warn(text),
        type: "TEXT",
    }
}