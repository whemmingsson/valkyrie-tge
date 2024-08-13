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
import Types from './types/types.js';

interface ConsoleGame {
    game: any;
    map: Map;
}

const ctx = Context.ctx;

class ConsoleGame {
    constructor(game) {
        if (!game) {
            throw new Error('Game not initialized. Please provide a game object.');
        }

        console.clear();
        logger.info(`\nInitializing game: ${game.name}\n`);

        this.game = game;
        this.map = buildMap(this.game.rooms);;

        // Prepare the game context
        ctx.currentRoom = this.map.rooms.find((room) => room.spawn);;
        ctx.playerDirection = this.game.startup.playerDirection;
        ctx.roomVisits = {};
        ctx.inventory = new Inventory();
        ctx.translations = this.game.translations;
        ctx.map = this.map;
        ctx.commandHistory = [];

        if (this.game.config) {
            ctx.config = {
                colors: parseColorScheme(this.game.config.colors),
                exitCommands: this.game.config.exitcommands
            }
        }

        CommandResolver.setup(this.game);

        // Pre game information (from engine)
        logger.info(`\nRunning game: ${this.game.name}\n`);
        logger.logWithTemplate(`You can type ${ctx.config.exitCommands.map(_ => "$").join(" or ")} to exit the game`, ...ctx.config.exitCommands);

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

        logger.logWithTemplate(Translation.translate(Translation.ON_GAME_START_ENTER_ROOM), [ctx.currentRoom.title]);

        const enterRoomEventAction = eventManager.getEnterRoomEventAction(ctx.currentRoom);

        if (enterRoomEventAction) {
            enterRoomEventAction.execute();
        }

        logger.logWithTemplate(Translation.translate(Translation.ON_GAME_START_PLAYER_FACING), [ctx.playerDirection.toLowerCase()]);

        // Run the game
        let exitStatus = ExitStatus.SUCCESS;
        while (true) {

            const command = prompt(Translation.translate(Translation.TYPE_COMMAND_PROMPT));

            if (ctx.config.exitCommands.includes(command)) {
                break;
            }

            if (command === 'restart' && Debug.DEBUG_MODE) {
                exitStatus = ExitStatus.RESTART;
                break;
            }

            ctx.commandHistory.push(command);

            logger.empty();

            const action = CommandResolver.resolve(command);

            if (!action) {
                logger.warn(Translation.translate(Translation.INVALID_COMMAND_WARNING));
                continue;
            }

            let actionResult: Types.Action | void = action;

            while (actionResult) {
                const triggeredAction = TriggeredEvents.findTriggeredEvent(actionResult.type, actionResult.target);
                if (triggeredAction) {
                    triggeredAction.execute();
                }
                actionResult = actionResult.execute();
            }

            logger.empty();
        }

        logger.info('\nStopping game...\n');
        return exitStatus;
    }
}

export default ConsoleGame;