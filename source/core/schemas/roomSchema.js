const roomSchema = {
    type: "object",
    properties: {
        schema: { type: "string" },
    },
    required: ["schema"], // The schema property is required - the rest are optional
    additionalProperties: true,
}

module.exports = roomSchema;