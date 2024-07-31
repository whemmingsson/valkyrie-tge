
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
        all_legacy: Event[];
        DEBUG: Event;
        INVENTORY: Event;
        TURN: Event,
        OPEN: Event;
        DESCRIBE: Event;
        all?: Event[];
        templates?: Event[];
        global?: Event[];
    }
}

export default GameTypes;