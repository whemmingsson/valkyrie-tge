
const argv = require('minimist')(process.argv.slice(2));
const welcome = require('./shell/ui/welcome');
const about = require('./shell/ui/about');
const { Menu } = require('./shell/ui/menu');
const manager = require('./manager');
const logger = require('../core/io/logger');

const menu = new Menu('Main Menu');

const run = () => {
    // Quick start to skip menus
    if (isQuickStart) {
        manager.run(true);
        return;
    }

    menu.register('1', 'List games', () => {
        manager.run();
    });

    menu.register('2', 'About', () => {
        about.display();
    });

    menu.register('x', 'Exit', () => {
        logger.default('Goodbye!');
        process.exit(0);
    });

    welcome.display();
    menu.run();
};

const isQuickStart = argv.quickstart || argv.q;

run();