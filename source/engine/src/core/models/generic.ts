import GameObject from "./gameObject.js";

class Generic extends GameObject {
    autoPickUp: any;
    direction: any;
    visible: any;
    constructor(source: any) {
        super(source);
        this.autoPickUp = source.autoPickUp;
        this.direction = source.direction;
        this.visible = source.visible;
        this.events = source.events || [];
    }
}

export default Generic;