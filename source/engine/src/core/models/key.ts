import objectFinder from "../../world/object-finder.js";

class Key {
    id: string;
    name: string;
    description: string;
    type: any;
    meta: any;
    containerId: string;
    autoPickUp: boolean;
    parent: any;
    visible: any;
    events: any;
    direction: any;
    constructor(source: any) {
        this.id = source.id;
        this.name = source.name;
        this.description = source.description;
        this.type = source.type;
        this.meta = source.meta;
        this.containerId = source.containerid;
        this.parent = source.parent;
        this.autoPickUp = source.autoPickUp;
        this.direction = source.direction; // Ugh. Should be inferred from the parent unless the parent is a room
        this.visible = source.visible;
        this.events = source.events || []; // TODO: Find a way of not tying this to the source object - this object should basically just be a data object for game state stuff
    }

    removeFromParent() {
        if (!this.containerId) {
            return;
        }

        // Find the parent container
        objectFinder.findById(this.containerId).removeItemById(this.id);
    }
}

export default Key;