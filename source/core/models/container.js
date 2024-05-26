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
}

module.exports = Container;