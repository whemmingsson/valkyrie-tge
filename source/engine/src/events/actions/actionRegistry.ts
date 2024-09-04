import output from "../../core/io/output.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";
import debug from "../../debug.js";

interface ActionBuilderMap {
    [key: string]: ActionBuilder;
}

interface ActionRegistry {
    actions: ActionBuilderMap;
}

class ActionRegistry {
    constructor() {
        this.actions = {} as ActionBuilderMap;
    }

    registerActionBuilder(type: string, builder: ActionBuilder) {
        if (debug.DEBUG_MODE) {
            output.debug(`Action registry: Registering action builder for ${type}`);
        }
        this.actions[type] = builder;
    }

    get() {
        return this.actions;
    }
}

export const actionRegistry = new ActionRegistry();
export const registerBuilder = actionRegistry.registerActionBuilder.bind(actionRegistry);