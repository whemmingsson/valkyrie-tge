import TakeableObject from "./takeableObject.js";

class Container extends TakeableObject {
    items: TakeableObject[];
    isOpen: boolean;
    isLocked: boolean;
    visible: boolean;
    constructor(source: any) {
        super(source);
        this.isOpen = source.open ?? false;
        this.isLocked = source.locked ?? false;
        this.items = [];
    }

    open() {
        this.isOpen = true;
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

    addItem(item: TakeableObject) {
        this.items.push(item);
    }

    removeItem(item: TakeableObject) {
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
}

export default Container;