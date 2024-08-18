import { ActionBuilder } from "../../core/types/actionBuilder.js";

// Noop action - does nothing
export const buildNoopAction: ActionBuilder = () => {
    return {
        execute: () => { },
        type: "NOOP",
    }
};