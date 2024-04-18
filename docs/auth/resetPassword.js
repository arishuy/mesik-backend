export default {
  post: {
    tags: ["auth"],
    operationId: "resetPassword",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              username: {
                type: "string",
                required: true,
              },
              email: {
                type: "string",
                required: true,
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "register successfully",
      },
    },
  },
};
