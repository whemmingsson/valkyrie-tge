import { Action } from "./action";

export type ActionBuilder = (...args: any[]) => Action; // This is what I dont like.