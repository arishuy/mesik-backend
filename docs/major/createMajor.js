export default {
  post: {
    tags: ["major"],
    operationId: "createMajor",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                require: true,
              },
              descriptions: {
                type: "string",
                require: true,
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
