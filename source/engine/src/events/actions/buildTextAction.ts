import { TextHelper } from "../../helpers/text-helper";
import Types from "../../types/types";
import { actionHooks } from "./actionHooks";

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