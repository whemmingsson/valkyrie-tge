import GameObject from "./gameObject.js";
import TakeableObject from "./takeableObject.js";

class Generic extends TakeableObject {
    direction: any;
    visible: any;
    constructor(source: any) {
        super(source);
        this.direction = source.direction;
        this.visible = source.visible;
        this.events = source.events || [];
    }
}

export default Generic;