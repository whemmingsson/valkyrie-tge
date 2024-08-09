import logger from "../../core/io/logger.js";
import Types from "../../types/types.js";

export const buildErrorAction: Types.ActionBuilder = (text) => {
    return {
        execute: () => logger.error(text),
        type: "TEXT",
    }
}