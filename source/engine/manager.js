const fs = require('fs');
const logger = require('../core/io/logger');
const { Menu, EXIT_OPTION } = require('./shell/ui/menu');
const Runner = require('./runner');

const GAME_DIR = 'games';

const manager = {};

const run = () => {
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

            const runner = new Runner(game);
            runner.run();
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

manager.run = run;

module.exports = manager;