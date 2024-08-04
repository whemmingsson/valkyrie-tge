import GameObject from "./gameObject.js";

class TakeableObject extends GameObject {
    autoPickUp: any;
    visible: any;
    direction: any;
    constructor(source) {
        super(source);
        this.autoPickUp = source.autoPickUp;
        this.direction = source.direction;
        this.visible = source.visible;
        this.events = source.events || [];
    }
}

export default TakeableObject;
