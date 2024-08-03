import logger from './core/io/logger.js';
import buildMap from './map-builder.js';
import CommandResolver from './command-resolver.js';
import TriggerResolver from './trigger-resolver.js';
import eventManager from './event-manager.js';
import Inventory from './core/models/inventory.js';
import Context from './game-context.js';
import prompt from './core/io/prompt.js';
import { Translation } from './translations.js';

interface GameRunner {
    game: any;
    map: any;
    commandResolver: CommandResolver;
    triggerResolver: TriggerResolver;
}

const ctx = Context.ctx;

class GameRunner {
    constructor(game) {
        this.game = game;
        this.map = null;
        this.commandResolver = new CommandResolver(this.game);
        this.triggerResolver = new TriggerResolver(this.game);

        if (!this.game) {
            throw new Error('Game not initialized');
        }

        ctx.currentRoom = this.game.rooms.find((room) => room.spawn);;
        ctx.playerDirection = this.game.startup.playerDirection;
        ctx.roomVisits = {};
        ctx.inventory = new Inventory();
        ctx.translations = this.game.translations;

        // DEBUG - test inventory
        ctx.inventory.items.push({ name: 'key', description: 'A shiny key' });

        this.map = buildMap(this.game.rooms);
        ctx.map = this.map;
    }

    run() {
        logger.info(`\nRunning game: ${this.game.name}\n`);
        logger.default("Remember that you can type 'x' or 'exit' to exit the game.\n");

        logger.default(this.game.title + "\n");
        logger.default(this.game.description + "\n");

        logger.logWithTemplate("You enter $ \n", [ctx.currentRoom.title]);

        const enterRoomEventAction = eventManager.getEnterRoomEventAction(ctx.currentRoom);

        if (enterRoomEventAction) {
            enterRoomEventAction();
        }

        logger.logWithTemplate("You are facing $ \n", [ctx.playerDirection.toLowerCase()]);

        // Run the game
        while (true) {

            const command = prompt(Translation.translate(Translation.TYPE_COMMAND_PROMPT));

            if (command === 'x' || command === 'exit') {
                break;
            }

            logger.empty();

            const action = this.commandResolver.resolve(command);

            if (!action) {
                logger.warn(Translation.translate(Translation.INVALID_COMMAND_WARNING));
                logger.empty();
                continue;
            }

            if (typeof action === 'string') {
                logger.warn(action);
                continue;
            }

            let actionResult = action();

            // Why cant we just return the action directly? Do we really need to let it be triggered?
            // Lets leave it for now, but we should consider refactoring this.

            let tmp;
            while (actionResult !== null && actionResult !== undefined) {
                tmp = this.triggerResolver.resolve(actionResult);
                if (typeof tmp === 'function') {
                    actionResult = tmp();
                }
                else if (typeof actionResult === 'function') {
                    actionResult = actionResult();
                }
                else if (typeof actionResult === 'string') {
                    logger.warn(actionResult);
                    break;
                }
                else {
                    break;
                }
            }

            logger.empty();
        }

        logger.info('\nStopping game.');
    }
}

export default GameRunner;