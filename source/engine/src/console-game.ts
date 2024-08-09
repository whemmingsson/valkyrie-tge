import logger from './core/io/logger.js';
import buildMap from './world/map-builder.js';
import eventManager from './events/event-manager.js';
import Inventory from './core/models/inventory.js';
import Context from './state/game-context.js';
import prompt from './core/io/prompt.js';
import { Translation } from './helpers/translations.js';
import { CommandResolver } from './command-resolver.js';
import Map from './core/models/map.js';
import { ExitStatus } from './types/exitStatus.js';
import Debug from './debug.js';
import { TriggeredEvents } from './events/trigger-finder.js';
import { parseColorScheme } from './helpers/color-helper.js';

interface ConsoleGame {
    game: any;
    map: Map;
}

const ctx = Context.ctx;

class ConsoleGame {
    constructor(game) {
        this.game = game;
        this.map = buildMap(this.game.rooms);;

        if (!this.game) {
            throw new Error('Game not initialized');
        }

        // Prepare the game context
        ctx.currentRoom = this.map.rooms.find((room) => room.spawn);;
        ctx.playerDirection = this.game.startup.playerDirection;
        ctx.roomVisits = {};
        ctx.inventory = new Inventory();
        ctx.translations = this.game.translations;
        ctx.map = this.map;

        if (this.game.config) {
            ctx.config = {
                colors: parseColorScheme(this.game.config.colors)
            }
        }

        CommandResolver.setup(this.game);

        // Pre game information (from engine)
        logger.info(`\nRunning game: ${this.game.name}\n`);
        logger.default("Remember that you can type 'x' or 'exit' to exit the game");

        if (Debug.DEBUG_MODE) {
            logger.warn("\nDebug mode is enabled. Type 'debug' to see debug information.");
            logger.warn("Type 'restart' to restart the game.");
            logger.empty();
        }
    }

    run(): ExitStatus {

        // Game information
        logger.default(this.game.title + "\n");
        logger.default(this.game.description + "\n");

        logger.logWithTemplate("You enter $ \n", [ctx.currentRoom.title]);

        const enterRoomEventAction = eventManager.getEnterRoomEventAction(ctx.currentRoom);

        if (enterRoomEventAction) {
            enterRoomEventAction.execute();
        }

        logger.logWithTemplate("You are facing $ \n", [ctx.playerDirection.toLowerCase()]);

        // Run the game
        let exitStatus = ExitStatus.SUCCESS;
        while (true) {

            const command = prompt(Translation.translate(Translation.TYPE_COMMAND_PROMPT));

            if (command === 'x' || command === 'exit') {
                break;
            }

            if (command === 'restart' && Debug.DEBUG_MODE) {
                exitStatus = ExitStatus.RESTART;
                break;
            }

            logger.empty();

            const action = CommandResolver.resolve(command);

            if (!action) {
                logger.warn(Translation.translate(Translation.INVALID_COMMAND_WARNING) + "\n");
                continue;
            }

            let actionResult = action.execute();

            while (actionResult) {
                const triggeredAction = TriggeredEvents.findTriggeredEvent(actionResult.type, actionResult.target);
                if (triggeredAction) {
                    triggeredAction.execute();
                }
                actionResult = actionResult.execute();
            }

            logger.empty();
        }

        logger.default('\nStopping game.\n');
        return exitStatus;
    }
}

export default ConsoleGame;