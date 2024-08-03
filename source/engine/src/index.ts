import minimist from "minimist";
import displayWelcome from './shell/ui/welcome.js';
import displayAbout from './shell/ui/about.js';
import { Menu } from './shell/ui/menu.js';
import gameLoader from './game-loader.js';
import logger from './core/io/logger.js';

// To handle source maps
import { install } from 'source-map-support';
install();

const argv = minimist(process.argv.slice(2));

const run = () => {
    // Quick start to skip menus
    if (argv.quickstart || argv.q) {
        gameLoader.run(true);
        return;
    }

    const menu = new Menu('Main Menu');

    menu.register('1', 'List games', () => {
        gameLoader.run(false);
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