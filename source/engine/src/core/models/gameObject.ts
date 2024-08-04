import objectFinder from "../../world/object-finder.js";

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
        parent.removeItemById(this.id);
    }
}

export default GameObject;