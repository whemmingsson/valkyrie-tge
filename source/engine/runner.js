const logger = require('../core/io/logger');
const prompt = require('prompt-sync')({ sigint: true });

class Runner {
    constructor(game) {
        this.game = game;
        this.context = {};
    }

    getSpawnRoom() {
        return this.game.rooms.find((room) => room.spawn);
    }

    init() {
        if (!this.game) {
            throw new Error('Game not initialized');
        }

        // Here we will do all pre-game setup
        // For example, setting up the spawn room
        const spawnRoom = this.getSpawnRoom();
        if (!spawnRoom) {
            throw new Error('Spawn room not found. Please define a spawn room in your game.');
        }

        this.context.currentRoom = spawnRoom;
    }

    run() {
        if (!this.game) {
            throw new Error('Game not initialized');
        }

        this.init();

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