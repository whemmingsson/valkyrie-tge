import { CommandResolver } from "../../engine/src/commandResolver.js";
import { Features } from "../../engine/src/core/features.js";
import output from "../../engine/src/core/io/output.js";
import Inventory from "../../engine/src/core/models/inventory.js";
import GameMap from "../../engine/src/core/models/map.js";
import { Action } from "../../engine/src/core/types/action.js";
import eventManager from "../../engine/src/events/event-manager.js";
import { TriggeredEvents } from "../../engine/src/events/trigger-finder.js";
import { parseColorScheme } from "../../engine/src/helpers/color-helper.js";
import { Translation } from "../../engine/src/helpers/translations.js";
import saveGameState from "../../engine/src/saveGameState.js";
import Ctx from "../../engine/src/state/ctx.js";
import { getContext } from "../../engine/src/state/game-context.js";
import buildMap from "../../engine/src/world/map-builder.js";

interface WebGame {
    game: any;
    map: GameMap;
    started: boolean;
}

class WebGame {
    constructor(game) {
        this.started = false;
        if (!game) {
            throw new Error('Game not initialized. Please provide a game object.');
        }

        const context = getContext();
        output.info(`\nInitializing game: ${game.name}\n`);

        this.game = game;
        this.map = buildMap(this.game.rooms);;

        // Prepare the game context
        context.clear();
        context.ctx.gameName = this.game.name;
        context.ctx.currentRoom = this.map.rooms.find((room) => room.spawn);;
        context.ctx.playerDirection = this.game.startup.playerDirection;
        context.ctx.roomVisits = {};
        context.ctx.inventory = new Inventory();
        context.ctx.translations = this.game.translations;
        context.ctx.map = this.map;
        context.ctx.commandHistory = [];

        if (this.game.config) {
            context.ctx.config = {
                colors: parseColorScheme(this.game.config.colors),
                exitCommands: this.game.config.exitcommands
            }
        }

        CommandResolver.setup(this.game);

        // Pre game information (from engine)
        output.info(`\nRunning game: ${this.game.name}\n`);
        output.logWithTemplate(`You can type ${context.ctx.config.exitCommands.map(_ => "$").join(" or ")} to exit the game`, ...context.ctx.config.exitCommands);

        console.log("Game context created", context);

    }

    startup() {
        const context = getContext();
        const ctx = context.ctx;

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