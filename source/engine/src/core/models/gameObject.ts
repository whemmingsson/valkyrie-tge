import objectFinder from "../../world/object-finder.js";
import logger from "../io/logger.js";

// Base class for all game objects. This class should be extended by all game objects.
class GameObject {
    id: string;
    name: string;
    description: string;
    type: any;
    meta: any;
    parent: any;
    events: any;
    containerId?: any;
    constructor(source: any) {
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

        const parent = objectFinder.findById(this.containerId);

        if (!parent) {
            // This is fine - the parent might have been removed entirely from the game state
            return;
        }

        parent.removeItemById(this.id);
    }
}

export default GameObject;