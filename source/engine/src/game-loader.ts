import fs from 'fs';
import logger from './core/io/logger.js';
import { Menu, EXIT_OPTION } from './shell/ui/menu.js';
import ConsoleGame from './console-game.js';
import DEBUG from './debug.js';

const GAME_DIR = 'games';

const gameLoader = {
    run: (quickStart: boolean) => {
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

                new ConsoleGame(game).run(); // Starting point
            });
        });

        menu.register(EXIT_OPTION, 'Back', () => {
            logger.default('Exiting game list menu.\n');
        });

        menu.run();
    }
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

    const runner = new ConsoleGame(game);
    runner.run();
}


export default gameLoader;