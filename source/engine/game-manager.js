const fs = require('fs');
const logger = require('../core/io/logger');
const { Menu, EXIT_OPTION } = require('./shell/ui/menu');
const Runner = require('./game-runner');
const DEBUG = require('./debug');

const GAME_DIR = 'games';

const manager = {};

const run = (quickStart) => {
    if (quickStart) {
        runQuickStart();
        return;
    }

    const menu = new Menu("Available Games");

    // Setup game menu
    const games = getAvailableGames();
    if (games.length === 0) {
        logger.warn('No games found.');
        return;
    }

    games.forEach((gameFilePath, i) => {
        menu.register(i.toString(), `Run ${gameFilePath}`, () => {
            const game = loadGameFile(gameFilePath);
            if (!game) {
                return;
            }

            new Runner(game).run();
        });
    });

    menu.register(EXIT_OPTION, 'Back', () => {
        logger.default('Exiting game list menu.\n');
    });

    menu.run();
}

const loadGameFile = (gamePath) => {
    const gameFilePath = `${GAME_DIR}/${gamePath}`;
    if (!fs.existsSync(gameFilePath)) {
        logger.error(`Game file not found: ${gameFilePath}. Was it deleted?`);
        return null;
    }

    return JSON.parse(fs.readFileSync(gameFilePath, 'utf8'));
}

const getAvailableGames = () => {
    if (!fs.existsSync(GAME_DIR)) {
        logger.warn(`Directory \'${GAME_DIR}\' not found. Creating it.`);
        fs.mkdirSync(GAME_DIR);
    }

    return fs.readdirSync(GAME_DIR);
}

const runQuickStart = () => {
    logger.info("Quickstart shell..");
    const game = loadGameFile(DEBUG.GAME_PATH);
    if (!game) {
        return;
    }

    const runner = new Runner(game);
    runner.run();
}

manager.run = run;

module.exports = manager;