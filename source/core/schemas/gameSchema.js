const gameSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        description: { type: "string" },
        version: { type: "string" },
        schema: { type: "string" },
    },
    required: ["schema", "name"], // The schema property is required - the rest are optional
    additionalProperties: false,
}

module.exports = gameSchema;