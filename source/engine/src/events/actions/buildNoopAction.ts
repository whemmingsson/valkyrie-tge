import Types from "../../types/types";

// Noop action - does nothing
export const buildNoopAction: Types.ActionBuilder = () => {
    return {
        execute: () => { },
        type: "NOOP",
    }
};