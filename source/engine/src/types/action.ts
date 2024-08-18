import { ActionType } from "./actionType";

export type Action = {
    execute: (() => Action | void);
    type: ActionType;
    target?: any;
}