import fs from 'fs';
import output from './core/io/output.js';
import { Menu, EXIT_OPTION } from './shell/ui/menu.js';
import ConsoleGame from './console-game.js';
import DEBUG from './debug.js';
import { ExitStatus } from './core/types/exitStatus.js';
import stripJsonComments from 'strip-json-comments';
import { Settings } from './core/settings.js';

const GAME_DIR = 'games';

const loadGameFile = (gamePath) => {
    const gameFilePath = `${GAME_DIR}/${gamePath}`;
    if (!fs.existsSync(gameFilePath)) {
        output.error(`Game file not found: ${gameFilePath}. Was it deleted?`);
        return null;
    }

    let rawGameData = fs.readFileSync(gameFilePath, 'utf8');

    if (Settings.ENABLE_JSON_WITH_COMMENTS) {
        rawGameData = stripJsonComments(rawGameData);
    }

    return JSON.parse(stripJsonComments(rawGameData));
}

const getAvailableGames = () => {
    if (!fs.existsSync(GAME_DIR)) {
        output.warn(`Directory \'${GAME_DIR}\' not found. Creating it.`);
        fs.mkdirSync(GAME_DIR);
    }

    return fs.readdirSync(GAME_DIR);
}

const runQuickStart = (gameFile?: string) => {
    output.info("\nQuickstart shell...");
    const gameFileToRun = gameFile || DEBUG.GAME_PATH;
    const game = loadGameFile(gameFileToRun);
    if (!game) {
        return;
    }

    const runner = new ConsoleGame(game);
    const status = runner.run();
    if (status === ExitStatus.RESTART) {
        output.info("Restarting game...\n");
        runQuickStart(gameFileToRun);
    }
}


export const loadAndRun = (quickStart: boolean, gameFile?: string) => {
    if (quickStart) {
        runQuickStart(gameFile);
        return;
    }

    const menu = new Menu("Available Games");

    // Setup game menu
    const games = getAvailableGames();
    if (games.length === 0) {
        output.warn('No games found.');
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
        output.default('Exiting game list menu.\n');
    });

    menu.run();
}
