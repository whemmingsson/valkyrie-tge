import logger from './core/io/logger.js';
import prompt from './core/io/prompt.js';
import * as util from 'util' // has no default export

interface Context {
    ctx: any;
}

class Context {
    constructor() {
        this.ctx = {};
    }

    print() {
        logger.debug("Game context");
        inspect(this.ctx);
    }
}

const inspect = (obj: object) => {
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
            logger.debug(util.inspect(obj));
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
};


export default new Context();