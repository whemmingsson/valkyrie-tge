import output from "../../core/io/output.js";
import { ActionBuilder } from "../../types/actionBuilder.js";

export const buildFormattedTextAction: ActionBuilder = (template: string, text: string) => {
    return {
        execute: () => output.logWithTemplate(template, text),
        type: "TEXT",
    }
}