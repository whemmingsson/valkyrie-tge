const argv = require('minimist')(process.argv.slice(2));
const welcome = require('./shell/ui/welcome');
const about = require('./shell/ui/about');
const { Menu } = require('./shell/ui/menu');
const manager = require('./game-manager');
const logger = require('./core/io/logger');

// To habndle source maps
const sourceMapSupport = require('source-map-support');
sourceMapSupport.install();

const run = () => {
    // Quick start to skip menus
    if (argv.quickstart || argv.q) {
        manager.run(true);
        return;
    }

    const menu = new Menu('Main Menu');

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

run();