const chalk = require('chalk');

const toStr = (obj) => {
    return JSON.stringify(obj, null, 2);
};

const log = (message, color) => {
    if (typeof message === 'object') {
        console.log(color(toStr(message)));
    } else {
        console.log(color(message));
    }
}

const logger = {
    error: (message) => {
        log(message, chalk.red);
    },
    info: (message) => {
        log(message, chalk.blue);
    },
    warn: (message) => {
        log(message, chalk.yellow);
    },
    log: (message) => {
        log(message, chalk.green);
    },
    success: (message) => {
        log(message, chalk.green);
    },
    default: (message) => {
        log(message, chalk.white);
    },
    debug: (message) => {
        log(message, chalk.magenta);
    },
    empty: () => {
        console.log();
    },
    message: (templateStr, ...args) => {
        const c = chalk.green;
        const coloredArgs = args.map((arg) => c(arg));
        // Assuming the template string contains $ as placeholder. 
        const messageParts = templateStr.split('$');
        let message = '';
        for (let i = 0; i < messageParts.length; i++) {
            message += messageParts[i];
            if (i < coloredArgs.length) {
                message += coloredArgs[i];
            }
        }
        console.log(message);

    }
};

module.exports = logger;
