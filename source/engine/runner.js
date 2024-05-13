const logger = require('../core/io/logger');
const mapBuilder = require('./map-builder.js');
const prompt = require('prompt-sync')({ sigint: true });
const CommandResolver = require('./command-resolver');
const eventManager = require('./event-manager');

class Runner {
    constructor(game) {
        this.game = game;
        this.context = {};
        this.map = null;
        this.init();
        this.resolver = new CommandResolver(this.game);
    }

    init() {
        if (!this.game) {
            throw new Error('Game not initialized');
        }

        const spawnRoom = this.game.rooms.find((room) => room.spawn);
        if (!spawnRoom) {
            throw new Error('Spawn room not found. Please define a spawn room in your game.');
        }

        this.context.currentRoom = spawnRoom;
        this.context.playerDirection = 'north'; // Default direction

        this.map = mapBuilder.build(this.game.rooms);
    }

    run() {
        logger.info(`\nRunning game: ${this.game.name}\n`);
        logger.default("Remember that you can type 'x' or 'exit' to exit the game.\n");

        logger.default(this.game.title + "\n");
        logger.default(this.game.description + "\n");

        logger.message("You enter $ \n", [this.context.currentRoom.title]);

        const enterRoomEventAction = eventManager.getEnterRoomEventAction(this.context.currentRoom);

        if (enterRoomEventAction) {
            enterRoomEventAction();
        }

        logger.message("You are facing $ \n", [this.context.playerDirection]);

        // Run the game
        while (true) {

            const command = prompt('Enter command: ');

            if (command === 'x' || command === 'exit') {
                break;
            }

            logger.empty();

            // Now the player have entered a command
            // This command needs to be translated into an action
            // The action needs to be executed
            // The result of the action needs to be displayed to the player

            const action = this.resolver.resolve(command);
            if (!action) {
                logger.warn('Invalid command. Please try again.\n');
                continue;
            }

            const actionResult = action();

            if (actionResult) {
                // It's worth noting that nothing in this game engine loop can trigger events except user inputs.
                // Therefore, it's entierly possible that the result of an action can trigger a new event.
                // This action had a result. Display it to the player for now.
                logger.message(actionResult);
            }

            logger.empty();
        }

        logger.info('\nStopping game.');
    }
}



module.exports = Runner;