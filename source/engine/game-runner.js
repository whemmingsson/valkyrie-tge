const prompt = require('prompt-sync')({ sigint: true });
const logger = require('../core/io/logger');
const mapBuilder = require('./map-builder.js');
const CommandResolver = require('./command-resolver');
const TriggerResolver = require('./trigger-resolver');
const eventManager = require('./event-manager');
const Inventory = require('../core/models/inventory');
const ctx = require('./game-context').ctx;

class Runner {
    constructor(game) {
        this.game = game;
        this.map = null;
        this.init();
        this.commandResolver = new CommandResolver(this.game);
        this.triggerResolver = new TriggerResolver(this.game);
    }

    init() {
        if (!this.game) {
            throw new Error('Game not initialized');
        }

        ctx.currentRoom = this.game.rooms.find((room) => room.spawn);;
        ctx.playerDirection = this.game.startup.playerDirection;
        ctx.roomVisits = {};
        ctx.inventory = new Inventory();

        // DEBUG - test inventory
        ctx.inventory.items.push({ name: 'key', description: 'A shiny key' });

        this.map = mapBuilder.build(this.game.rooms);
        ctx.map = this.map;
    }

    run() {
        logger.info(`\nRunning game: ${this.game.name}\n`);
        logger.default("Remember that you can type 'x' or 'exit' to exit the game.\n");

        logger.default(this.game.title + "\n");
        logger.default(this.game.description + "\n");

        logger.message("You enter $ \n", [ctx.currentRoom.title]);

        const enterRoomEventAction = eventManager.getEnterRoomEventAction(ctx.currentRoom);

        if (enterRoomEventAction) {
            enterRoomEventAction();
        }

        logger.message("You are facing $ \n", [ctx.playerDirection.toLowerCase()]);

        // Run the game
        while (true) {

            const command = prompt('Enter command: ');

            if (command === 'x' || command === 'exit') {
                break;
            }

            logger.empty();

            const action = this.commandResolver.resolve(command);
            if (!action) {
                logger.warn('Invalid command. Please try again.\n');
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
            while (actionResult) {
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

module.exports = Runner;