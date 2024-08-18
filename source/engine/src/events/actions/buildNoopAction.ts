import { ActionBuilder } from "../../types/actionBuilder.js";

// Noop action - does nothing
export const buildNoopAction: ActionBuilder = () => {
    return {
        execute: () => { },
        type: "NOOP",
    }
};