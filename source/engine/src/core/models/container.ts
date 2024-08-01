import Key from "./key";

class Container {
    id: any;
    name: string;
    description: string;
    direction: string;
    items: (Key | Container)[];
    isOpen: boolean;
    isLocked: boolean;
    constructor(source: any) {
        this.id = source.id;
        this.name = source.name;
        this.description = source.description;
        this.items = [];
        this.isOpen = source.open ?? false;
        this.isLocked = source.locked ?? false;
        this.direction = source.direction;
    }

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }

    unlock() {
        this.isLocked = false;
    }

    addItem(item: Key | Container) {
        this.items.push(item);
    }

    removeItem(item: Key | Container) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            return this.items.splice(index, 1)[0];
        }
    }
}

export default Container;