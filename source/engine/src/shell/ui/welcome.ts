import output from '../../core/io/output.js';

const displayWelcome = () => {
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

    output.default(text);
}

export default displayWelcome;