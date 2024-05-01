const schemas = require('../core/schemas/all');
const Ajv = require('ajv');
const logger = require('./io/logger');

const schemaValidator = new Ajv();

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

const transformErrors = (errors) => {
    const map = {};
    errors.forEach((error) => {
        const file = error.fileName;
        if (!map[file]) {
            map[file] = [];
        }

        if (error.error) {
            map[file].push(error.error);
        }
        if (error.errors) {
            map[file].push(...error.errors.map((err) => err.message));
        }

    });
    return map;
}

const validateWithSchemas = (definition, fileName, schema) => {
    if (!schema) {
        throw new Error(`Schema not found for definition ${fileName}.`);
    }
    const validate = schemaValidator.compile(schema);
    const valid = validate(definition);
    return {
        valid: valid, errors: constructErrorMessages(fileName, validate.errors)
    }
}

const validateFormat = (contentMap) => {
    const errors = [];
    for (const [key, value] of Object.entries(contentMap)) {

        if (!value.schema) {
            errors.push({ fileName: key, error: `No schema defined for ${key}. All definitions must have a schema property. Refer to the documentation for more info.` });
            continue;
        }

        if (!schemas[value.schema]) {
            errors.push({ fileName: key, error: `Schema ${value.schema} not found. Please check the schema property in ${key}.` });
            continue;
        }

        const validationResult = validateWithSchemas(value, key, schemas[value.schema]);

        if (!validationResult.valid) {
            errors.push(validationResult.errors);
        }
    }

    return transformErrors(errors);
};

module.exports = validateFormat;