import logger from "../../core/io/logger";
import Types from "../../types/types";

export const buildErrorAction: Types.ActionBuilder = (text) => {
    return {
        execute: () => logger.error(text),
        type: "TEXT",
    }
}