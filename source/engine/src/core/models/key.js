class Key {
    constructor(source) {
        this.id = source.id;
        this.name = source.name;
        this.description = source.description;
        this.type = source.type;
        this.meta = source.meta;
        this.containerId = source.containerid;
    }
}

export default Key;