import Types from "../../types/types.js";
import context from '../../state/game-context.js';

export const buildDebugAction: Types.ActionBuilder = () => {
    return {
        execute: () => context.print(),
        type: "DEBUG",
    }
}