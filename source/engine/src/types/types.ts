
namespace Types {
    export interface Mapping {
        inputs: string[];
        rule: string;
    }

    export interface Event {
        trigger: string;
        action: string;
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

    export type ActionType = "NOOP" | "TEXT" | "DEBUG" | "INVENTORY" | "PICKUP" | "OPEN" | "CLOSE" | "TURN" | "DESCRIBE" | "DELETE_ITEM_INVENTORY" | "UNKNOWN";

    export type Action = {
        execute: (() => Action | void);
        type: ActionType;
        target?: any;
    }

    export type ActionBuilder = (...args: any[]) => Action; // This is what I dont like.
}

export default Types;