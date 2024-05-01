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
    }
};

module.exports = logger;