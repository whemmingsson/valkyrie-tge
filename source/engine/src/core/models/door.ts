import GameObject from "./gameObject.js";

class Door extends GameObject {
    isOpen: boolean;
    isLocked: boolean;
    direction: any;
    constructor(door: any) {
        super(door);
        this.isOpen = door.open;
        this.isLocked = door.locked;
        this.direction = door.direction.toUpperCase();
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