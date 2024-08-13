import GameObject from "./gameObject.js";

class TakeableObject extends GameObject {
    autopickup: boolean;
    visible: boolean;
    direction: string;
    constructor(source) {
        super(source);
        this.autopickup = source.autopickup;
        this.direction = source.direction;
        this.visible = source.visible;
        this.events = source.events || [];
    }
}

export default TakeableObject;
