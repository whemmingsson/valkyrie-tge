import GameObject from "../models/gameObject.js";
import { Condition } from "./condition.js";
import { Mapping } from "./mapping.js";

export interface GameEvent {
    conditions: Condition[];
    trigger: string;
    action: string;
    meta?: any;
    scope?: string;
    target?: string;
    mappings?: Mapping[];
};
