import { getContext } from "../state/game-context.js"



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
    export const ACTION_DELETE_ITEM_INVENTORY_NO_TARGET_WARNING = "action_delete_item_inventory_no_target_warning";
    export const ACTION_TURN_INVALID_DIRECTION_WARNING = "action_turn_invalid_direction_warning";
    export const ACTION_UNLOCK_NO_TARGET_WARNING = "action_unlock_no_target_warning";
    export const ACTION_UNLOCK_TARGET_UNLOCKED_WARNING = "action_unlock_target_unlocked_warning";
    export const ACTION_UNLOCK_MISSING_KEY_WARNING = "action_unlock_missing_key_warning";
    export const ON_GAME_START_ENTER_ROOM = "on_game_start_enter_room";
    export const ON_GAME_START_PLAYER_FACING = "on_game_start_player_facing";

    // If the game dev forgot to add a translation, we will use these fallbacks. But the compiler should warn about this.
    const translationFallback = {
        [ACTION_DESCRIBE_NO_TARGET_WARNING]: "No target object found to describe. Did you spell it correctly?",
        [ACTION_DESCRIBE_NO_DESCRIPTION_INFO]: "There is nothing special about this object.",
        [ACTION_OPEN_NO_TARGET_WARNING]: "No target object found to open. Did you spell it correctly?",
        [ACTION_CLOSE_NO_TARGET_WARNING]: "No target object found to close. Did you spell it correctly?",
        [ACTION_PICKUP_NO_TARGET_WARNING]: "No target object found to pick up. Did you spell it correctly?",
        [ACTION_PICKUP_NO_TARGET_IN_INVENTORY_WARNING]: "No target object found to pick up. It's already in your inventory.",
        [INVALID_COMMAND_WARNING]: "Invalid command. Please try again.\n",
        [TYPE_COMMAND_PROMPT]: "Type command: ",
        [ACTION_DELETE_ITEM_INVENTORY_NO_TARGET_WARNING]: "No target object found to delete from inventory.",
        [ACTION_TURN_INVALID_DIRECTION_WARNING]: "Invalid direction. Please try again.",
        [ACTION_UNLOCK_NO_TARGET_WARNING]: "No target object found to unlock. Did you spell it correctly?",
        [ACTION_UNLOCK_TARGET_UNLOCKED_WARNING]: "Target object is already unlocked.",
        [ACTION_UNLOCK_MISSING_KEY_WARNING]: "You need a key to unlock this object. Either you don't have any keys or you don't have the right key.",
        [ON_GAME_START_ENTER_ROOM]: "You enter room $\n",
        [ON_GAME_START_PLAYER_FACING]: "You are facing $\n"
    };

    export const translate = (key: string) => {
        const ctx = getContext().ctx;
        return ctx.translations[key] || translationFallback[key] || 'Unknown translation key: ' + key;
    };
}