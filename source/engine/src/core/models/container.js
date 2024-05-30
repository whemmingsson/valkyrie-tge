class Container {
    constructor(item) {
        this.id = item.id;
        this.name = item.name;
        this.description = item.description;
        this.items = [];
        this.isOpen = item.open ?? false;
        this.isLocked = item.locked ?? false;
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

    addItem(item) {
        this.items.push(item);
    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            return this.items.splice(index, 1)[0];
        }
    }
}

module.exports = Container;