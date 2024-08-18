
import { findById } from "../../world/object-finder.js";
import Container from "./container.js";

// Base class for all game objects. This class should be extended by all game objects.
class GameObject {
    source: any;
    id: string;
    name: string;
    description: string;
    type: any;
    meta: any;
    parent: any;
    events: any;
    containerId?: string;
    constructor(source: any) {
        this.source = source;
        this.id = source.id;
        this.name = source.name;
        this.description = source.description;
        this.type = source.type;
        this.meta = source.meta;
        this.events = source.events || [];
        this.containerId = source.containerId;
    }

    removeFromParent() {
        if (!this.containerId) {
            return;
        }

        const parent = findById(this.containerId);

        if (!parent) {
            // This is fine - the parent might have been removed entirely from the game state
            return;
        }

        if (parent instanceof Container) {
            parent.removeItemById(this.id);
        }
        else {
            throw new Error(`Parent is not a container. Cannot remove item from parent.`);
        }
    }
}

export default GameObject;