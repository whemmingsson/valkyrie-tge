import Types from "../../types/types.js";

// Noop action - does nothing
export const buildNoopAction: Types.ActionBuilder = () => {
    return {
        execute: () => { },
        type: "NOOP",
    }
};