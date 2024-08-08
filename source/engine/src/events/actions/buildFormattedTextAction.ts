import logger from "../../core/io/logger";
import Types from "../../types/types";

export const buildFormattedTextAction: Types.ActionBuilder = (template, text) => {
    return {
        execute: () => logger.logWithTemplate(template, text),
        type: "TEXT",
    }
}