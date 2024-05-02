const logger = require('../../../core/io/logger.js');
const prompt = require('prompt-sync')({ sigint: true });

const toArr = (obj) => {
    return Object.keys(obj).map((key) => obj[key]);
}

const shellMenu = {
    optCounter: 0,
    exitOpt: { opt: 'x', text: 'Exit', action: () => { logger.default('Exiting...'); process.exit(0); } },
    items: {},
    itemsArr: [],

    display: () => {
        logger.default('Menu:');
        toArr(shellMenu.items).forEach((item) => { logger.default(` ${item.opt}. ${item.text}`); });
    },

    run: () => {
        // Add exit option - always last - at least for now
        shellMenu.items[shellMenu.exitOpt.opt] = shellMenu.exitOpt;

        let choice = '';
        while (true) {
            shellMenu.display();
            choice = prompt(':> ');

            if (!shellMenu.items[choice]) {
                logger.default('Invalid choice. Please try again.');
                continue;
            }

            shellMenu.items[choice].action();
        }
    },

    register: (text, action) => {
        const opt = (++shellMenu.optCounter).toString();
        shellMenu.items[opt] = { opt, text, action };
    }
};




module.exports = shellMenu;