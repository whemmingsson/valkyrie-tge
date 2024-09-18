import { GameEvent } from "./core/types/event.js";

export interface EventRegistryMap {
    [key: string]: GameEvent[];
}