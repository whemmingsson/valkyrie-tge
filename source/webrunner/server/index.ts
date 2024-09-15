import express from 'express';
import helmet from 'helmet';
import RateLimit from "express-rate-limit";
import { getAllGames } from './repository.js';
import dotenv from 'dotenv';
import { loadGame } from '../../engine/src/gameLoader.js';
import WebGame from './WebGame.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express();
dotenv.config();

const port = 3000;

const cl = console.log

// Call this for regular sever logging
const log = (...args) => {
    cl.apply(console, args);
};

const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
});

app.use(helmet());
app.use(limiter);

// Hack of the century - intercept console.log to collect messages
const regex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g
let messages = [];

console.log = function (...args) {
    if (process.env.OUTPUT_CONSOLE === "TRUE") {
        cl.apply(console, args);
    }

    const rawMessages = args as string[];
    if (rawMessages.length === 0) {
        messages.push("\n");
        return;
    }

    for (let i = 0; i < rawMessages.length; i++) {
        const msg = rawMessages[i];
        if (typeof msg === 'string') {
            const split = msg.split('\n');
            split.forEach((message) => {
                if (regex.test(message)) {
                    const justText = message.replace(regex, '');
                    messages.push(justText);
                }
                else {
                    messages.push(message);
                }
            });
        }
        else {
            messages.push("Invalid system message: " + msg);
        }
    }
}

let webGame: WebGame;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../../../../client/dist')));

app.post('/api/say', (req, res) => {
    if (!webGame.started) {
        res.send(['Game not started\n']);
        return;
    }

    log(req.headers.clientid);

    const { command } = req.body;
    if (command) {
        messages = [];
        webGame.processCommand(command);
        res.send(messages);
    } else {
        res.status(400).send('Bad Request: "command" field is required');
    }
});

app.post('/api/start', (req, res) => {
    log(req.headers.clientid);

    const { gameFile } = req.body;
    if (gameFile) {
        if (webGame && webGame.started) {
            res.send(['Game already started']);
            return;
        }

        webGame = new WebGame(loadGame(gameFile));
        messages = [];
        webGame.startup();
        res.send(messages);
    } else {
        res.status(400).send('Bad Request: "gameFile" field is required');
    }
});

app.post('/api/stop', (req, res) => {
    if (webGame) {
        webGame = null;
        res.send(['Game stopped']);
    } else {
        res.send(['No game running']);
    }
});

app.get('/api/games', (_, res) => {
    const games = getAllGames();
    res.send(games);
});

app.get('/health', (_, res) => {
    res.send('OK');
});


app.get('/api/clientid', (_, res) => {
    res.send(crypto.randomUUID());
});


// Start the server
app.listen(port, () => {
    log(`Server is running on http://localhost:${port}`);
    log("Using runner:", process.env.RUNNER);
});