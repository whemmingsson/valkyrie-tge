const gameSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        description: { type: "string" },
        version: { type: "string" },
    },
    required: ["name"],
    additionalProperties: false,
}

module.exports = gameSchema;