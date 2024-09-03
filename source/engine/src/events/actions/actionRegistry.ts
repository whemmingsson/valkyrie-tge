import { ActionBuilder } from "../../core/types/actionBuilder";

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
        console.log(`Registering action builder for ${type}`);
        this.actions[type] = builder;
    }

    get() {
        return this.actions;
    }
}

export const actionRegistry = new ActionRegistry();
export const register = actionRegistry.registerActionBuilder.bind(actionRegistry);