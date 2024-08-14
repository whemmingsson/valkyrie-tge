import output from '../core/io/output.js';
import prompt from '../core/io/prompt.js';
import * as util from 'util' // has no default export
import Ctx from './ctx.js';

interface Context {
    ctx: Ctx;
}

class Context {
    constructor() {
        this.ctx = {} as Ctx;
    }

    print() {
        output.debug("Game context");
        inspect(this.ctx);
    }
}

const inspect = (obj: object) => {
    if (!obj) {
        output.error("Object is null or undefined");
        return;
    }
    let input = '';
    while (input !== 'x') {
        output.debug("\nEnter property to inspect (x to exit): ");
        input = prompt(': ');
        if (input && input.toLowerCase() === 'x') {
            break;
        }
        if (!input) {
            output.error("Property not found");
            continue;
        }
        if (input === '.') {
            output.debug(util.inspect(obj));
            continue;
        }
        try {
            // We are on dangerous ground here. We are using eval to access the object properties.
            // Since this is a developer tool, we can take the risk. But in production code, this is a big no-no.
            eval(`logger.debug(obj.${input});`);
        }
        catch (e) {
            output.error(`Property '${input}' not found`);
        }
    }
};


export default new Context();