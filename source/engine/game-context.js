const prompt = require('prompt-sync')({ sigint: true });
const logger = require('../core/io/logger');
class Context {
    constructor() {
        this.ctx = {};
    }

    print() {
        logger.debug("Game context");
        inspector.run(this.ctx);
    }
}

const inspector = {};

inspector.run = (obj) => {
    if (!obj) {
        logger.error("Object is null or undefined");
        return;
    }
    let input = '';
    while (input !== 'x') {
        logger.debug("\nEnter property to inspect (x to exit): ");
        input = prompt(': ');
        if (input && input.toLowerCase() === 'x') {
            break;
        }
        if (!input) {
            logger.error("Property not found");
            continue;
        }
        if (input === '.') {
            logger.debug(obj);
            continue;
        }
        try {
            // We are on dangerous ground here. We are using eval to access the object properties.
            // Since this is a developer tool, we can take the risk. But in production code, this is a big no-no.
            eval(`logger.debug(obj.${input});`);
        }
        catch (e) {
            logger.error(`Property '${input}' not found`);
        }
    }
}



module.exports = new Context();