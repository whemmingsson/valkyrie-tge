import minimist from "minimist";
import displayWelcome from './shell/ui/welcome.js';
import displayAbout from './shell/ui/about.js';
import { Menu } from './shell/ui/menu.js';
import gameLoader from './game-loader.js';
import logger from './core/io/logger.js';
import Debug from './debug.js';

// To handle source maps
import { install } from 'source-map-support';
install();

const argv = minimist(process.argv.slice(2));

const run = () => {
    // Quick start to skip menus
    if (argv.quickstart || argv.q && Debug.DEBUG_MODE === true) {
        gameLoader.run(true);
        return;
    }

    // Quick start with a specific game
    if (argv.g) {
        gameLoader.run(true, argv.g);
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