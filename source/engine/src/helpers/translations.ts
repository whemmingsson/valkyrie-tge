import gameContext from "../state/game-context.js"
const ctx = gameContext.ctx

// Language support for built-in messages

export namespace Translation {
    // Keys available for the engine to use
    export const ACTION_DESCRIBE_NO_TARGET_WARNING = "action_describe_no_target_warning";
    export const ACTION_DESCRIBE_NO_DESCRIPTION_INFO = "action_describe_no_description_info";
    export const ACTION_OPEN_NO_TARGET_WARNING = "action_open_no_target_warning";
    export const ACTION_CLOSE_NO_TARGET_WARNING = "action_close_no_target_warning";
    export const ACTION_PICKUP_NO_TARGET_WARNING = "action_pickup_no_target_warning";
    export const ACTION_PICKUP_NO_TARGET_IN_INVENTORY_WARNING = "action_pickup_no_target_in_inventory_warning";
    export const INVALID_COMMAND_WARNING = "invalid_command_warning";
    export const TYPE_COMMAND_PROMPT = "type_command_prompt"

    // If the game dev forgot to add a translation, we will use these fallbacks. But the compiler should warn about this.
    const translationFallback = {
        [ACTION_DESCRIBE_NO_TARGET_WARNING]: "No target object found to describe. Did you spell it correctly?",
        [ACTION_DESCRIBE_NO_DESCRIPTION_INFO]: "There is nothing special about this object.",
        [ACTION_OPEN_NO_TARGET_WARNING]: "No target object found to open. Did you spell it correctly?",
        [ACTION_CLOSE_NO_TARGET_WARNING]: "No target object found to close. Did you spell it correctly?",
        [ACTION_PICKUP_NO_TARGET_WARNING]: "No target object found to pick up. Did you spell it correctly?",
        [ACTION_PICKUP_NO_TARGET_IN_INVENTORY_WARNING]: "No target object found to pick up. It's already in your inventory.",
        [INVALID_COMMAND_WARNING]: "Invalid command. Please try again.",
        [TYPE_COMMAND_PROMPT]: " Type command: "
    };

    export const translate = (key: string) => {
        return ctx.translations[key] || translationFallback[key] || 'Unknown translation key: ' + key;
    };
}