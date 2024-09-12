import express from 'express';
import cors from 'cors';
import { getAllGames } from './repository.js';
import dotenv from 'dotenv';
import { loadGame } from '../../engine/src/gameLoader.js';
import WebGame from './WebGame.js';
const app = express();
dotenv.config();

const port = 3000;

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
};

const cl = console.log

// Call this for regular sever logging
const log = (message) => {
    cl.apply(console, message);
};

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

// TODO: This is a hack to get the game running
const rawGame = loadGame('demo_game.jsonc');
let webGame = new WebGame(rawGame);

app.use(express.json());
app.use(cors(corsOptions));

app.post('/api/say', (req, res) => {
    if (!webGame.started) {
        res.send(['Game not started\n']);
        return;
    }

    const { command } = req.body;
    messages = [];
    if (command) {
        messages = [];
        webGame.processCommand(command);
        res.send(messages);
    } else {
        res.status(400).send('Bad Request: "command" field is required');
    }
});

app.post('/api/start', (req, res) => {
    const { gameFile } = req.body;
    if (gameFile) {
        webGame = new WebGame(rawGame);
        if (!webGame.started) {
            messages = [];
            webGame.startup();
            res.send(messages);
        }
        else {
            res.send(['Game already started']);
        }
    } else {
        res.status(400).send('Bad Request: "gameFile" field is required');
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
    //console.log(`Server is running on http://localhost:${port}`);
    //console.log("Using runner:", process.env.RUNNER);
});