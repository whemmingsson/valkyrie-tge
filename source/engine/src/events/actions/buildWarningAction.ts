import logger from "../../core/io/logger.js";
import Types from "../../types/types.js";

export const buildWarningAction: Types.ActionBuilder = (text) => {
    return {
        execute: () => logger.warn(text),
        type: "TEXT",
    }
}