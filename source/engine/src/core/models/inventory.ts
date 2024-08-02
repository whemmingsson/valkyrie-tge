import Key from './key.js';
import logger from '../io/logger.js';
import Item from './item.js';

type InventoryItem = Key | Item;

class Inventory {
    items: InventoryItem[];
    constructor() {
        this.items = [];
    }

    addItem(item: InventoryItem) {
        this.items.push(item);
    }

    removeItem(item: InventoryItem) {
        this.items = this.items.filter(i => i !== item);
    }

    hasItem(item: InventoryItem) {
        return this.items.includes(item);
    }

    hasItemById(id: string) {
        return this.items.some(item => item.id === id);
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