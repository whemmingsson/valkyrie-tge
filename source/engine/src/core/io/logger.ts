import chalk from 'chalk';
import GameTypes from '../../types/types';

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
    logAnnotated: (elements: GameTypes.TextElement[]) => {
        let annotatedString = '';
        elements.forEach(element => {
            const color = colorMap[element.color] || chalk.white;
            annotatedString += color(element.text);
        });

        console.log(annotatedString);
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

export default logger;
