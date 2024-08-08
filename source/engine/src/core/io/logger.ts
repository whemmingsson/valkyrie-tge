import chalk from 'chalk';
import Types from '../../types/types';

// TODO: I dont really like the name logger - it's short but something like ConsolePrinter would be more descriptive

const toStr = (obj: object) => {
    try {
        return JSON.stringify(obj, null, 2);
    } catch (e) {
        return obj;
    }
};

const log = (message: string | object, color: chalk.Chalk) => {
    if (typeof message === 'object') {
        console.log(color(toStr(message)));
    } else {
        console.log(color(message));
    }
}

// Map between color codes and chalk functions
const colorMap = {
    "r": chalk.red,
    "g": chalk.green,
    "b": chalk.blue,
    "y": chalk.yellow,
    "m": chalk.magenta,
    "c": chalk.cyan,
    "w": chalk.white,
};

const logger = {
    error: (message: string) => {
        log(message, chalk.red);
    },
    info: (message: string) => {
        log(message, chalk.blue);
    },
    warn: (message: string) => {
        log(message, chalk.yellow);
    },
    log: (message: string) => {
        log(message, chalk.green);
    },
    logAnnotated: (elements: Types.TextElement[]) => {
        console.log(elements.reduce((acc, element) => {
            return acc + (colorMap[element.color] || chalk.white)(element.text);
        }, ''));
    },
    success: (message: string) => {
        log(message, chalk.green);
    },
    default: (message: string) => {
        log(message, chalk.white);
    },
    debug: (message: string | object) => {
        log(message, chalk.magenta);
    },
    empty: () => {
        console.log();
    },
    logWithTemplate: (templateStr: string, ...args) => {
        const coloredArgs = args.map(arg => chalk.green(arg));
        const message = templateStr.split('$').reduce((acc, part, index) => {
            return acc + part + (coloredArgs[index] || '');
        }, '');

        console.log(message);
    }
};

export default logger;
