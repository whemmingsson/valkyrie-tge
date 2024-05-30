import logger from '../../core/io/logger.js';
import promt from 'prompt-sync';

const _promt = promt({ sigint: true });
const EXIT_OPTION = 'x';

const toArr = (obj) => {
    return Object.keys(obj).map((key) => obj[key]);
}

class Menu {
    constructor(title) {
        this.items = {};
        this.title = title;
    }

    display() {
        logger("\n" + (this.title ?? 'Menu'));
        toArr(this.items).forEach((item) => { logger(` ${item.opt}. ${item.text}`); });
    }

    run() {
        let choice = '';
        while (true && choice !== EXIT_OPTION) {
            this.display();
            choice = _promt(':> ');

            if (!this.items[choice]) {
                logger('Invalid choice. Please try again.\n');
                continue;
            }

            this.items[choice].action();
        }
    }

    register(opt, text, action) {
        this.items[opt] = { opt, text, action };
    }
}




export { Menu, EXIT_OPTION };