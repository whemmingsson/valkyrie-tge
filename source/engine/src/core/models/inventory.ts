import Key from './key.js';
import logger from '../io/logger.js';

class Inventory {
    items: Key[];
    constructor() {
        this.items = [];
    }

    addItem(item: Key) {
        this.items.push(item);
    }

    removeItem(item: Key) {
        this.items = this.items.filter(i => i !== item);
    }

    hasItem(item: Key) {
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

export default Inventory;