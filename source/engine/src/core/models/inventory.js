const logger = require('../io/logger');

class Inventory {
    constructor() {
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(item) {
        this.items = this.items.filter(i => i !== item);
    }

    hasItem(item) {
        return this.items.includes(item);
    }

    getItems() {
        return this.items;
    }

    print() {
        logger.log('Inventory:');
        this.items.forEach(item => {
            logger.log(`- ${item.name} - (${item.description})`);
        });
    }
}

module.exports = Inventory;