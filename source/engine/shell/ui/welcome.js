const logger = require('../../../core/io/logger.js');
const welcome = {};

welcome.display = () => {
    const text =
        `
__      __   _ _               _         _____ _          _ _ 
\\ \\    / /  | | |             (_)       / ____| |        | | |
 \\ \\  / /_ _| | | ___   _ _ __ _  ___  | (___ | |__   ___| | |
  \\ \\/ / _\` | | |/ / | | | '__| |/ _ \\  \\___ \\| '_ \\ / _ \\ | |
   \\  / (_| | |   <| |_| | |  | |  __/  ____) | | | |  __/ | |
    \\/ \\__,_|_|_|\\_\\\\__, |_|  |_|\\___| |_____/|_| |_|\\___|_|_|
                     __/ |                                    
                    |___/                 Engine Version: 1.0`;

    logger.default(text);
}

module.exports = welcome;