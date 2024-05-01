const fs = require('fs');

const logger = require('./io/logger');

const validateFormat = require('./validator');
const argv = require('minimist')(process.argv.slice(2));


const SOURCE_DIR = 'definitions';
const ENCODING = 'utf8';
const OUTPUT_FILE = 'output.json';

const getDefinitionsDirectory = () => {
    if (!argv.d) {
        logger.warn('No directory specified. Using default directory \'definitions\'. (Specify a directory using the -d flag. Example: node index.js -d my-directory)');
    }
    return argv.d || SOURCE_DIR;
}


const writeOutput = (contentMap) => {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(contentMap, null, 2), ENCODING);
}

const logErrors = (errors) => {
    for (const [key, value] of Object.entries(errors)) {
        logger.error(`Errors in ${key}:`);
        value.forEach((error) => {
            logger.error(" " + error);
        });
        logger.empty();
    }
}


const run = () => {
    const sourceDir = getDefinitionsDirectory();

    if (!fs.existsSync(sourceDir)) {
        logger.error(`Directory \'${sourceDir}\' not found.`);
        return;
    }

    const contentMap = {};

    // Limitation: Can only read one level deep
    fs.readdirSync(sourceDir, ENCODING).forEach((path) => {
        contentMap[path] = JSON.parse(fs.readFileSync(`${sourceDir}/${path}`, ENCODING));
    });

    const validationErrors = validateFormat(contentMap);

    if (validationErrors) {
        logger.error("Validation failed. Exiting.");
        logErrors(validationErrors);
        return;
    }

    logger.success("Validation successful.");
    writeOutput(contentMap);
};


run();