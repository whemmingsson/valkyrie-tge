class Door {
    constructor(door) {
        this.id = door.id;
        this.isOpen = door.open;
        this.isLocked = door.locked;
        this.direction = door.direction.toUpperCase();
        this.name = door.name;
        this.description = door.description;
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

export default Door;