class Container {
    constructor(item) {
        this.id = item.id;
        this.name = item.name;
        this.description = item.description;
        this.items = [];
    }
}

module.exports = Container;