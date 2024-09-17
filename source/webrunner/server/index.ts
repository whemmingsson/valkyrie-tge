import express from 'express';
import helmet from 'helmet';
import RateLimit from "express-rate-limit";
import { getAllGames } from './repository.js';
import dotenv from 'dotenv';
import { loadGame } from '../../engine/src/gameLoader.js';
import WebGame from './WebGame.js';
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { fileURLToPath } from 'url';
import cors from 'cors';
import transformConsoleMessages from './transformConsoleMessages.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const reactAppPath = path.join(__dirname, '../../../dist/client/');
const isProduction = process.env.NODE_ENV === 'production';

const developmentPort = 3000;
const productionPort = 8080;
const productionSSLPort = 8443;

const cl = console.log;
const log = (...args) => {
    cl.apply(console, args);
};

const app = express();

if (isProduction) {
    app.use(helmet());
    app.use(RateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 20,
    }));
} else {
    const corsOptions = {
        origin: 'http://localhost:5173',
        optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions));
}

app.use(express.json());
app.use(express.static(reactAppPath));

let messages = [];

console.log = function (...args) {
    if (process.env.OUTPUT_CONSOLE === "TRUE") {
        cl.apply(console, args);
    }

    messages.push(...transformConsoleMessages(args || []));
}

let webGame: WebGame;

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

if (isProduction) {
    const credentials = { key: fs.readFileSync('server.key', 'utf8'), cert: fs.readFileSync('server.crt', 'utf8') };
    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(credentials, app);

    httpServer.listen(productionPort, () => {
        log(`Server is running on http://localhost:${productionPort}`);

    });
    httpsServer.listen(productionSSLPort, () => {
        log(`Server is running on https://localhost:${productionSSLPort}`);
    });
}
else {
    app.listen(developmentPort, () => {
        log(`Server is running on http://localhost:${developmentPort}`);
        log("Using runner:", process.env.RUNNER);
    });
}


