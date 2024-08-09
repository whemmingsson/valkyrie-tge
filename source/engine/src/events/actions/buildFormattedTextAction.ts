import logger from "../../core/io/logger.js";
import Types from "../../types/types.js";

export const buildFormattedTextAction: Types.ActionBuilder = (template, text) => {
    return {
        execute: () => logger.logWithTemplate(template, text),
        type: "TEXT",
    }
}