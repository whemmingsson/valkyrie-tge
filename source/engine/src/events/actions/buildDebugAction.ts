import { ActionBuilder } from "../../core/types/actionBuilder.js";
import context from '../../state/game-context.js';

export const buildDebugAction: ActionBuilder = () => {
    return {
        execute: () => context.print(),
        type: "DEBUG",
    }
}