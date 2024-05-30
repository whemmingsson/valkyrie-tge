//const argv = require('minimist')(process.argv.slice(2));

import minimist from "minimist";
import welcome from './shell/ui/welcome.js';
import about from './shell/ui/about.js';
import { Menu } from './shell/ui/menu.js';
import manager from './game-manager.js';
import logger from './core/io/logger.js';

// To habndle source maps
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
        runGame();
    });

    menu.register('2', 'About', () => {
        about.display();
    });

    menu.register('x', 'Exit', () => {
        logger('Goodbye!');
        process.exit(0);
    });

    welcome.display();
    menu.run();
};

run();