const fs = require('fs');
const Ajv = require('ajv');
const logger = require('./io/logger');

const ajv = new Ajv();

const SOURCE_DIR = 'definitions';
const SCHEMA_DIR = './core/schemas/';
const ENTRYPOINT_FILE = 'game.json';
const ENCODING = 'utf8';

const hasEntrypoint = (paths) => {
    return paths.includes(ENTRYPOINT_FILE);
}

const constructErrorMessages = (fileName, errors) => {
    if (!errors) {
        return [];
    }

    return errors.map((error) => {
        return `${fileName} ${error.message}`;
    }).join('\n');
}

const validateDefinition = (definition, schema) => {
    const validate = ajv.compile(schema);
    const valid = validate(definition);
    return {
        valid: valid, errors: constructErrorMessages(ENTRYPOINT_FILE, validate.errors)
    }
}

const loadSchema = (schemaName) => {
    return require(`${SCHEMA_DIR}${schemaName}.schema.js`);
}

const contentMap = {};

const run = () => {
    // Check of the directory even exist
    if (!fs.existsSync(SOURCE_DIR)) {
        logger.error(`Directory ${SOURCE_DIR} not found. Please create the directory and add some files to it.`);
        return;
    }

    const paths = fs.readdirSync(SOURCE_DIR, ENCODING);

    // Check if the entrypoint file exists
    if (!hasEntrypoint(paths)) {
        logger.error(`Entrypoint file not found in ${SOURCE_DIR}. Please add a file named ${ENTRYPOINT_FILE} to the directory.`);
        return;
    }

    paths.forEach((path) => {
        const fileContent = fs.readFileSync(`${SOURCE_DIR}/${path}`, ENCODING);
        contentMap[path] = JSON.parse(fileContent);
    });

    // Validate the entrypoint file
    const entrypointSchema = loadSchema('game');
    const validationResult = validateDefinition(contentMap[ENTRYPOINT_FILE], entrypointSchema);
    if (!validationResult.valid) {
        logger.error(validationResult.errors);
        return;
    }

    logger.info(contentMap);
};



run();