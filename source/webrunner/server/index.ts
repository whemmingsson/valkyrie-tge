import express from 'express';
import cors from 'cors';
import { getAllGames } from './repository.js';
const app = express();

const port = 3000;

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

app.post('/api/say', (req, res) => {
    const { command } = req.body;
    if (command) {
        res.send(`I'm hearing you say '${command}' but the game is not running yet.`);
    } else {
        res.status(400).send('Bad Request: "text" field is required');
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
    console.log(`Server is running on http://localhost:${port}`);
});