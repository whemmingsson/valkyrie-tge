const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const logger = require('./io/logger');
const validateFormat = require('./validator');

const SOURCE_DIR = 'definitions';
const ENCODING = 'utf8';
const OUTPUT_FILE = 'output.json';

const getDefinitionsDirectory = () => {
    if (!argv.d) {
        logger.warn('No directory specified. Using default directory \'definitions\'. (Specify a directory using the -d flag. Example: node index.js -d my-directory)');
    }
    return argv.d || SOURCE_DIR;
}

const buildContentMap = (sourceDir) => {
    const map = {};
    readFromDirectoryRecursive(sourceDir, map, 0);
    return map;
}

const readFromDirectoryRecursive = (directory, map) => {
    fs.readdirSync(directory, ENCODING).forEach((path) => {
        const fullPath = `${directory}/${path}`;
        if (fs.lstatSync(fullPath).isDirectory()) {
            readFromDirectoryRecursive(fullPath, map);
        }
        else if (path.endsWith('.json')) {
            try {
                map[path] = JSON.parse(fs.readFileSync(fullPath, ENCODING));
            }
            catch (e) {
                if (e instanceof SyntaxError) {
                    logger.error(`Error parsing JSON file ${path}. Ensure that the file is valid JSON.`);
                    logger.warn(`Skipping file ${path}. Your game may not work as expected.\n`);
                }
                else {
                    logger.error(`Unexpected error reading file ${path}.\n`);
                    throw e;
                }
            }
        }
        else {
            logger.warn(`Skipping file ${path} as it is not a JSON file.\n`);
        }
    });
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

const writeOutput = (contentMap) => {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(contentMap, null, 2), ENCODING);
}

const run = () => {
    const sourceDir = getDefinitionsDirectory();

    if (!fs.existsSync(sourceDir)) {
        logger.error(`Directory \'${sourceDir}\' not found.`);
        return;
    }

    const contentMap = buildContentMap(sourceDir);
    const validationErrors = validateFormat(contentMap);

    if (validationErrors) {
        logger.error("Schema validation failed. Please fix the following errors:");
        logErrors(validationErrors);
        return;
    }

    logger.success("Schema validation successful.");
    writeOutput(contentMap);
};


run();