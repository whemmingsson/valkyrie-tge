import minimist from "minimist";
import displayWelcome from './shell/ui/welcome.js';
import displayAbout from './shell/ui/about.js';
import { Menu } from './shell/ui/menu.js';
import output from './core/io/output.js';
import Debug from './debug.js';
import { install } from 'source-map-support';
import { loadAndRun } from "./gameLoader.js";
import dotenv from 'dotenv';

install();
dotenv.config();
const argv = minimist(process.argv.slice(2));
console.log(process.env.RUNNER);

const run = () => {
    // Quick start to skip menus
    if (argv.quickstart || argv.q && Debug.DEBUG_MODE === true) {
        loadAndRun(true);
        return;
    }

    // Quick start with a specific game
    if (argv.g) {
        loadAndRun(true, argv.g);
        return;
    }

    const menu = new Menu('Main Menu');

    menu.register('1', 'List games', () => {
        loadAndRun(false);
    });

    menu.register('2', 'About', () => {
        displayAbout();
    });

    menu.register('x', 'Exit', () => {
        output.default('Goodbye!');
        process.exit(0);
    });

    displayWelcome();
    menu.run();
};

run();