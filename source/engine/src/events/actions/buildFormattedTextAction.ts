import { ACTION_TEXT } from "../../core/constants/events/actionTypes.js";
import output from "../../core/io/output.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";

export const buildFormattedTextAction: ActionBuilder = (template: string, text: string) => {
    return {
        execute: () => output.logWithTemplate(template, text),
        type: ACTION_TEXT,
    }
}