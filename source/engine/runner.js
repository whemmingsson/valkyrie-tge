const logger = require('../core/io/logger');
const mapBuilder = require('./map-builder.js');
const prompt = require('prompt-sync')({ sigint: true });

class Runner {
    constructor(game) {
        this.game = game;
        this.context = {};
        this.map = null;
        this.init();
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

    resolveCommand(command) {
        // Resolve the command
        // Return the result of the command
        return () => logger.warn('Resolver not implemented yet. Command: ' + command + '\n');
    }

    run() {
        logger.info(`\nRunning game: ${this.game.name}\n`);
        logger.default("Remember that you can type 'x' or 'exit' to exit the game.\n");

        logger.default(this.game.title + "\n");
        logger.default(this.game.description + "\n");

        logger.message("You enter $ \n", [this.context.currentRoom.title]);
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

            const action = this.resolveCommand(command);
            action();
            logger.empty();
        }

        logger.info('\nStopping game.');
    }
}



module.exports = Runner;