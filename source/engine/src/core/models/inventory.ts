import logger from '../io/logger.js';
import TakeableObject from './takeableObject';

class Inventory {
    items: TakeableObject[];
    constructor() {
        this.items = [];
    }

    addItem(item: TakeableObject) {
        this.items.push(item);
    }

    removeItem(item: TakeableObject) {
        this.items = this.items.filter(i => i !== item);
    }

    hasItem(item: TakeableObject) {
        return this.items.includes(item);
    }

    hasItemWithId(id: string) {
        return this.items.some(item => item.id === id);
    }

    getItems() {
        return this.items;
    }

    findItemByName(name: string) {
        return this.items.find(item => item.name === name);
    }

    findItemById(id: string) {
        return this.items.find(item => item.id === id);
    }

    print() {
        if (this.items.length === 0) {
            logger.warn('Inventory is empty');
            return;
        }

        logger.log('Inventory:');
        this.items.forEach(item => {
            logger.log(`> ${item.name} - (${item.description})`);
        });
    }
}

export default Inventory;