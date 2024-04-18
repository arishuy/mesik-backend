export default {
  put: {
    tags: ["major"],
    operationId: "updateMajor",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "major_id",
        in: "path",
        schema: {
          type: "string",
        },
        require: true,
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              descriptions: {
                type: "string",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {},
    },
  },
};
