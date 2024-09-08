const express = require('express');
const cors = require('cors');
const app = express();

const port = 3000;

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
};

// Middleware to parse JSON request bodies
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


app.get('/health', (req, res) => {
    res.send('OK');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});