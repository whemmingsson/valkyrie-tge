import output from './core/io/output.js';
import buildMap from './world/map-builder.js';
import eventManager from './events/event-manager.js';
import Inventory from './core/models/inventory.js';
import Context from './state/game-context.js';
import prompt from './core/io/prompt.js';
import { Translation } from './helpers/translations.js';
import { CommandResolver } from './commandResolver.js';
import GameMap from './core/models/map.js';
import { ExitStatus } from './core/types/exitStatus.js';
import Debug from './debug.js';
import { TriggeredEvents } from './events/trigger-finder.js';
import { parseColorScheme } from './helpers/color-helper.js';
import { Action } from './core/types/action.js';

interface ConsoleGame {
    game: any;
    map: GameMap;
}

const ctx = Context.ctx;

class ConsoleGame {
    constructor(game) {
        if (!game) {
            throw new Error('Game not initialized. Please provide a game object.');
        }

        //console.clear();
        output.info(`\nInitializing game: ${game.name}\n`);

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
        output.info(`\nRunning game: ${this.game.name}\n`);
        output.logWithTemplate(`You can type ${ctx.config.exitCommands.map(_ => "$").join(" or ")} to exit the game`, ...ctx.config.exitCommands);

        if (Debug.DEBUG_MODE) {
            output.warn("\nDebug mode is enabled. Type 'debug' to see debug information.");
            output.warn("Type 'restart' to restart the game.");
            output.empty();
        }
    }

    run(): ExitStatus {

        // Game information
        output.default(this.game.title + "\n");
        output.default(this.game.description + "\n");

        output.logWithTemplate(Translation.translate(Translation.ON_GAME_START_ENTER_ROOM), [ctx.currentRoom.title]);

        const enterRoomEventAction = eventManager.getEnterRoomEventAction(ctx.currentRoom);

        if (enterRoomEventAction) {
            enterRoomEventAction.execute();
        }

        output.logWithTemplate(Translation.translate(Translation.ON_GAME_START_PLAYER_FACING), [ctx.playerDirection.toLowerCase()]);

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

            output.empty();

            const action = CommandResolver.resolve(command);

            if (!action) {
                output.warn(Translation.translate(Translation.INVALID_COMMAND_WARNING));
                continue;
            }

            let actionResult: Action | void = action;

            while (actionResult) {
                const triggeredAction = TriggeredEvents.findTriggeredEvent(actionResult.type, actionResult.target);
                if (triggeredAction) {
                    triggeredAction.execute();
                }
                actionResult = actionResult.execute();
            }

            output.empty();
        }

        output.info('\nStopping game...\n');
        return exitStatus;
    }
}

export default ConsoleGame;