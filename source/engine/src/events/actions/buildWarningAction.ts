import output from "../../core/io/output.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";

export const buildWarningAction: ActionBuilder = (text: string) => {
    return {
        execute: () => output.warn(text),
        type: "TEXT",
    }
}