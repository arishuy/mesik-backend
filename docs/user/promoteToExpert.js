export default {
  post: {
    tags: ["user"],
    operationId: "promoteToExpert",
    description: "used for user to promote to expert",
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              descriptions: {
                type: "string",
                require: true,
              },
            },
          },
        },
      },
    },
    responses: {},
  },
};
