const logger = require('../../../core/io/logger.js');
const about = {};

about.display = () => {
    const text = `
Overview
--------
Valkyrie is a game engine designed to be simple and easy to use. It is built with JavaScript and Node.js, and is intended to be used for text-based games. Valkyrie provides a simple API for creating and managing game content, and includes a built-in shell for running and testing games.

Running games
-------------
To run a game, place the game file in the 'games' directory and run the shell. The shell will automatically detect the game and run it.

Building games
--------------
To build a game, you need to use the Valkyrie Compiler. The compiler reads game definitions (.json files) from the 'definitions' directory, validates the content and outputs a master JSON file that can be used by this shell. You can specify a different directory using the -d flag. For example: node index.js -d my-directory
`;
    logger.default(text);
}

module.exports = about;