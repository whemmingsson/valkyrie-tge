import { GameEvent } from "./event";

export interface Events {
    DEBUG: GameEvent;
    ANNOTATE: GameEvent;
    INVENTORY: GameEvent;
    TURN: GameEvent,
    OPEN: GameEvent;
    DESCRIBE: GameEvent;
    PICKUP: GameEvent;
    UNLOCK: GameEvent;
    all_legacy: GameEvent[];
    all?: GameEvent[];
    templates?: GameEvent[];
    global?: GameEvent[];
}