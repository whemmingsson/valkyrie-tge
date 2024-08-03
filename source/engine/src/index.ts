import minimist from "minimist";
import displayWelcome from './shell/ui/welcome.js';
import displayAbout from './shell/ui/about.js';
import { Menu } from './shell/ui/menu.js';
import manager from './game-manager.js';
import logger from './core/io/logger.js';

// To handle source maps
import { install } from 'source-map-support';
install();

const argv = minimist(process.argv.slice(2));

const run = () => {
    // Quick start to skip menus
    if (argv.quickstart || argv.q) {
        manager.run(true);
        return;
    }

    const menu = new Menu('Main Menu');

    menu.register('1', 'List games', () => {
        manager.run(false);
    });

    menu.register('2', 'About', () => {
        displayAbout();
    });

    menu.register('x', 'Exit', () => {
        logger.default('Goodbye!');
        process.exit(0);
    });

    displayWelcome();
    menu.run();
};

run();