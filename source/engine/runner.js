const logger = require('../core/io/logger');
const mapBuilder = require('.core/map-builder.js');
const prompt = require('prompt-sync')({ sigint: true });

class Runner {
    constructor(game) {
        this.game = game;
        this.context = {};
        this.map = null;

        this.init();
    }

    getSpawnRoom() {
        return this.game.rooms.find((room) => room.spawn);
    }

    init() {
        if (!this.game) {
            throw new Error('Game not initialized');
        }

        // Find the spawn room
        const spawnRoom = this.getSpawnRoom();
        if (!spawnRoom) {
            throw new Error('Spawn room not found. Please define a spawn room in your game.');
        }

        // Set the current room to the spawn room
        this.context.currentRoom = spawnRoom;

        // Build the map
        this.map = mapBuilder.build(this.game.rooms);
    }

    run() {
        logger.info(`\nRunning game: ${this.game.name}\n`);

        logger.default(this.game.title + "\n");
        logger.default(this.game.description + "\n");

        // Run the game
        while (true) {
            const command = prompt('Enter command (x to exit): ');

            if (command === 'x' || command === 'exit') {
                break;
            }

            //const result = this.game.execute(command);
            logger.info(result);
        }
    }
}



module.exports = Runner;