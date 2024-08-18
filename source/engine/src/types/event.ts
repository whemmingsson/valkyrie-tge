import { Mapping } from "./mapping.js";

export interface GameEvent {
    trigger: string;
    action: string;
    meta?: any;
    mappings?: Mapping[];
};
