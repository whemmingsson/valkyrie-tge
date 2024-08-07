
namespace GameTypes {
    export interface Mapping {
        inputs: String[];
        rule: String;
    }

    export interface Event {
        trigger: String;
        action: String;
        meta?: any;
        mappings?: Mapping[];
    };

    export interface Events {
        DEBUG: Event;
        ANNOTATE: Event;
        INVENTORY: Event;
        TURN: Event,
        OPEN: Event;
        DESCRIBE: Event;
        PICKUP: Event;
        all_legacy: Event[];
        all?: Event[];
        templates?: Event[];
        global?: Event[];
    }

    export interface TextElement {
        text: string;
        color?: string;
    };

    export type ActionType = "TEXT" | "DEBUG" | "INVENTORY" | "PICKUP" | "OPEN" | "CLOSE" | "TURN" | "DESCRIBE" | "DELETE_ITEM_INVENTORY" | "UNKNOWN";

    export type Action = {
        execute: () => Action | void;
        type: GameTypes.ActionType;
    }
}

export default GameTypes;