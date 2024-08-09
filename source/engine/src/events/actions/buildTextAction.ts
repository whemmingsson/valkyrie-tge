import { TextHelper } from "../../helpers/text-helper.js";
import Types from "../../types/types.js";
import { actionHooks } from "./actionHooks.js";

export const buildTextAction: Types.ActionBuilder = (event: Types.Event) => {
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