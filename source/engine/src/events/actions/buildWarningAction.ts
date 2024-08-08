import logger from "../../core/io/logger";
import Types from "../../types/types";

export const buildWarningAction: Types.ActionBuilder = (text) => {
    return {
        execute: () => logger.warn(text),
        type: "TEXT",
    }
}