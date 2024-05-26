class Door {
    constructor(id, open, locked) {
        this.id = id;
        this.isOpen = open;
        this.isLocked = locked;
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