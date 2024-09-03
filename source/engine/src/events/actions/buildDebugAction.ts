
import { ACTION_DEBUG } from "../../core/constants/events/actionTypes.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";
import context from '../../state/game-context.js';
import { register } from "./actionRegistry.js";

export const buildDebugAction: ActionBuilder = () => {
    return {
        execute: () => context.print(),
        type: "DEBUG",
    }
}

register(ACTION_DEBUG, buildDebugAction);