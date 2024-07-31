// NOTE: This file is not used. Left it here for reference.

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

let rl = null;

const open = async () => {
    rl = readline.createInterface({ input, output });
    rl.on('SIGINT', () => {
        console.log("SIGINT");
        rl.close();
    });
    return rl;
}

const readInput = async (q) => {
    if (!rl) {
        console.log("rl is null");
        return;
    }
    const choice = await rl.question(q);
    //rl.close();
    return choice;
}

const close = async () => {
    if (rl) {
        rl.close();
    }
}

export { readInput, close, open };