import { TextHelper } from "../../helpers/text-helper.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";
import { GameEvent } from "../../core/types/event.js";
import { actionHooks } from "./actionHooks.js";
import { register } from "./actionRegistry.js";
import { ACTION_TEXT } from "../../core/constants/events/actionTypes.js";

export const buildTextAction: ActionBuilder = (event: GameEvent) => {
    return {
        execute: () => {
            const hook = actionHooks[event.trigger];
            if (hook) {
                hook();
            }

            TextHelper.logText(event.meta.text);
        },
        type: "TEXT",
    }
}

register(ACTION_TEXT, buildTextAction);