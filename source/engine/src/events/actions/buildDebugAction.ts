
import { ACTION_DEBUG } from "../../core/constants/events/actionTypes.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";
import { getContext } from '../../state/game-context.js';
import { registerBuilder } from "./actionRegistry.js";

const context = getContext();

export const buildDebugAction: ActionBuilder = () => {
    return {
        execute: () => context.print(),
        type: ACTION_DEBUG,
    }
}

registerBuilder(ACTION_DEBUG, buildDebugAction);