import { CommandResolver } from "../../engine/src/commandResolver.js";
import { Features } from "../../engine/src/core/features.js";
import output from "../../engine/src/core/io/output.js";
import Inventory from "../../engine/src/core/models/inventory.js";
import GameMap from "../../engine/src/core/models/map.js";
import { Action } from "../../engine/src/core/types/action.js";
import { ExitStatus } from "../../engine/src/core/types/exitStatus";
import eventManager from "../../engine/src/events/event-manager.js";
import { TriggeredEvents } from "../../engine/src/events/trigger-finder.js";
import { parseColorScheme } from "../../engine/src/helpers/color-helper.js";
import { Translation } from "../../engine/src/helpers/translations.js";
import saveGameState from "../../engine/src/saveGameState.js";
import { getContext } from "../../engine/src/state/game-context.js";
import buildMap from "../../engine/src/world/map-builder.js";

interface WebGame {
    game: any;
    map: GameMap;
    started: boolean;
}

const ctx = getContext().ctx;

class WebGame {
    constructor(game) {
        this.started = false;
        if (!game) {
            throw new Error('Game not initialized. Please provide a game object.');
        }

        //console.clear();
        output.info(`\nInitializing game: ${game.name}\n`);

        this.game = game;
        this.map = buildMap(this.game.rooms);;

        // Prepare the game context
        ctx.gameName = this.game.name;
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

        /*if (Debug.DEBUG_MODE) {
            output.warn("\nDebug mode is enabled. Type 'debug' to see debug information.");
            output.warn("Type 'restart' to restart the game.");
            output.empty();
        } */
    }

    startup() {
        // Game information
        output.default(this.game.title);
        output.empty();
        output.default(this.game.description + "\n");

        output.logWithTemplate(Translation.translate(Translation.ON_GAME_START_ENTER_ROOM), [ctx.currentRoom.title]);

        const enterRoomEventAction = eventManager.getEnterRoomEventAction(ctx.currentRoom);

        if (enterRoomEventAction) {
            enterRoomEventAction.execute();
        }

        output.logWithTemplate(Translation.translate(Translation.ON_GAME_START_PLAYER_FACING), [ctx.playerDirection.toLowerCase()]);
        this.started = true;
    }

    processCommand(command: string) {

        output.empty();

        const action = CommandResolver.resolve(command);

        if (!action) {
            output.warn(Translation.translate(Translation.INVALID_COMMAND_WARNING));
            return
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

        if (Features.ENABLE_QUICKSAVE) {
            saveGameState(true);
        }
    }
}

export default WebGame;