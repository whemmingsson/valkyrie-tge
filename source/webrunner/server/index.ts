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

// Hack of the century - intercept console.log to collect messages
const regex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g
let messages = [];

const cl = console.log
console.log = function (...args) {
    messages.push(args);
    cl.apply(console, args);
}

const rawGame = loadGame('demo_game.jsonc');
let webGame = new WebGame(rawGame);

app.use(express.json());
app.use(cors(corsOptions));

const cleanupMessages = (messages) => {
    const cleaned = [];

    messages.forEach((message) => {
        if (regex.test(message)) {
            const justText = message.replace(regex, '');
            cleaned.push(justText);
        }
        else {
            cleaned.push(message);
        }
    });

    return cleaned;
}

app.post('/api/say', (req, res) => {
    const { command } = req.body;
    if (command) {
        res.send(`I'm hearing you say '${command}' but the game is not running yet.`);
    } else {
        res.status(400).send('Bad Request: "text" field is required');
    }
});

app.post('/api/start', (req, res) => {
    const { gameFile } = req.body;
    if (gameFile) {
        webGame = new WebGame(rawGame);
        if (!webGame.started) {
            messages = [];
            webGame.startup();
            const formattedMessages = messages.flatMap((message) => message);
            const cleanedMessages = cleanupMessages(formattedMessages);
            res.send(cleanedMessages);
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