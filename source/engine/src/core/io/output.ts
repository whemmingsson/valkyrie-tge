import chalk from 'chalk';
import { TextElement } from '../types/textElements';


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

const output = {
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
    logAnnotated: (elements: TextElement[], colorMap: any) => {
        console.log(elements.reduce((acc, element) => {
            return acc + (colorMap[element.color] || chalk.white)(element.text);
        }, ''));
    },
    success: (message: string) => {
        log(message, chalk.green);
    },
    default: (message: string | string[]) => {
        if (Array.isArray(message)) {
            message.forEach(msg => log(msg, chalk.white));
            return;
        }
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

export default output;
