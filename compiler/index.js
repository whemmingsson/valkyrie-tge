const fs = require('fs');
const Ajv = require('ajv');
const logger = require('./io/logger');
const schemas = require('./core/schemas/all');
const argv = require('minimist')(process.argv.slice(2));

const schemaValidator = new Ajv();

const SOURCE_DIR = 'definitions';
const ENTRYPOINT_FILE = 'game.json';
const ENCODING = 'utf8';
const OUTPUT_FILE = 'output.json';

const getDefinitionsDirectory = () => {
    if (!argv.d) {
        logger.warn('No directory specified. Using default directory \'definitions\'. (Specify a directory using the -d flag. Example: node index.js -d my-directory)');
    }
    return argv.d || SOURCE_DIR;
}

const hasEntrypoint = (paths) => {
    return paths.includes(ENTRYPOINT_FILE);
}

const constructErrorMessages = (fileName, errors) => {
    if (!errors) {
        return {};
    }

    return {
        fileName: fileName,
        errors: errors.map((error) => {
            return {
                message: error.message
            }
        })
    };
}

const isValidSchemaName = (schemaName) => {
    return schemas[schemaName] ? true : false;
}

const validateDefinition = (definition, fileName, schema) => {
    if (!schema) {
        throw new Error(`Schema not found for definition ${fileName}.`);
    }
    const validate = schemaValidator.compile(schema);
    const valid = validate(definition);
    return {
        valid: valid, errors: constructErrorMessages(fileName, validate.errors)
    }
}

const loadSchema = (schemaName) => {
    return schemas[schemaName];
}

const writeOutput = (contentMap) => {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(contentMap, null, 2), ENCODING);
}

const validateFormat = (contentMap) => {
    const globalErrors = [];
    for (const [key, value] of Object.entries(contentMap)) {

        if (!value.schema) {
            globalErrors.push({ fileName: key, error: `No schema defined for ${key}. All definitions must have a schema property. Refer to the documentation for more info.` });
            continue;
        }

        if (!isValidSchemaName(value.schema)) {
            globalErrors.push({ fileName: key, error: `Schema ${value.schema} not found. Please check the schema property in ${key}.` });
            continue;
        }

        const schema = loadSchema(value.schema);
        const validationResult = validateDefinition(value, key, schema);

        if (!validationResult.valid) {
            globalErrors.push(validationResult.errors);
        }
    }

    if (!globalErrors.length) {
        return true;
    }
    else {
        logger.error("Could not compile the following files:");
        logger.error(globalErrors);
        return false;
    }
}

const run = () => {
    const sourceDir = getDefinitionsDirectory();

    if (!fs.existsSync(sourceDir)) {
        logger.error(`Directory ${sourceDir} not found.`);
        return;
    }

    const paths = fs.readdirSync(sourceDir, ENCODING);

    if (!hasEntrypoint(paths)) {
        logger.error(`Entrypoint file not found in ${sourceDir}. Please add a file named ${ENTRYPOINT_FILE} to the directory.`);
        return;
    }

    const contentMap = {};

    paths.forEach((path) => {
        contentMap[path] = JSON.parse(fs.readFileSync(`${SOURCE_DIR}/${path}`, ENCODING));
    });

    if (!validateFormat(contentMap)) {
        logger.error("Validation failed. Exiting.");
        return;
    }

    logger.success("Validation successful.");
    writeOutput(contentMap);
};


run();