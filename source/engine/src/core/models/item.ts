import objectFinder from "../../world/object-finder.js";

class Item {
    id: string;
    name: string;
    description: string;
    type: any;
    meta: any;
    containerId: string;
    autoPickUp: boolean;
    parent: any;
    direction: string;
    visible: boolean;
    events: any;
    constructor(source: any) {
        this.id = source.id;
        this.name = source.name;
        this.description = source.description;
        this.type = source.type;
        this.meta = source.meta;
        this.containerId = source.containerid;
        this.parent = source.parent;
        this.autoPickUp = source.autoPickUp;
        this.direction = source.direction;
        this.visible = source.visible;
        this.events = source.events || [];
    }

    removeFromParent() {
        if (!this.containerId) {
            return;
        }

        const parent = objectFinder.findById(this.containerId);
        parent.removeItemById(this.id);
    }
}

export default Item;