class Key {
    id: string;
    name: string;
    description: string;
    type: any;
    meta: any;
    containerId: string;
    constructor(source: any) {
        this.id = source.id;
        this.name = source.name;
        this.description = source.description;
        this.type = source.type;
        this.meta = source.meta;
        this.containerId = source.containerid;
    }
}

export default Key;