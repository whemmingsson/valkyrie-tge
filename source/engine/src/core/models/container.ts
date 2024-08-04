import objectFinder from "../../world/object-finder.js";
import Item from "./item";
import Key from "./key";

class Container {
    id: any;
    name: string;
    description: string;
    direction: string;
    items: (Key | Container | Item)[];
    isOpen: boolean;
    isLocked: boolean;
    containerId: any;
    visible: boolean;
    events: any[];
    constructor(source: any) {
        this.id = source.id;
        this.name = source.name;
        this.description = source.description;
        this.items = [];
        this.isOpen = source.open ?? false;
        this.isLocked = source.locked ?? false;
        this.direction = source.direction;
        this.containerId = source.containerid;
        this.visible = source.visible || true;
        this.events = source.events || [];
    }

    open() {
        this.isOpen = true;
        // Enable picking up child items by setting their visibility to true
        this.items.forEach((item) => {
            item.visible = true;
        });
    }

    close() {
        this.isOpen = false;
        this.items.forEach((item) => {
            item.visible = false;
        });
    }

    unlock() {
        this.isLocked = false;
    }

    addItem(item: Key | Container) {
        this.items.push(item);
    }

    removeItem(item: Key | Container | Item) { //TODO:  This is getting silly. We should have a base class for all items
        const index = this.items.indexOf(item);
        if (index > -1) {
            return this.items.splice(index, 1)[0];
        }
    }

    removeItemById(id: string) {
        const item = this.items.find(item => item.id === id);
        if (!item) {
            return;
        }

        this.removeItem(item);
    }

    removeFromParent() {
        if (!this.containerId) {
            return;
        }

        // Find the parent container
        objectFinder.findById(this.containerId).removeItemById(this.id);
    }
}

export default Container;