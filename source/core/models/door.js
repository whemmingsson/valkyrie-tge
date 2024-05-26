class Door {
    constructor(id, open, locked, direction, name) {
        this.id = id;
        this.isOpen = open;
        this.isLocked = locked;
        this.direction = direction.toUpperCase();
        this.name = name;
    }

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }

    lock() {
        this.isLocked = true;
    }

    unlock() {
        this.isLocked = false;
    }

}

module.exports = Door;