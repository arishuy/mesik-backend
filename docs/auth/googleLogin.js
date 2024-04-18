export default {
  post: {
    tags: ["auth"],
    operationId: "googleLogin",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              credential: {
                type: "object",
                require: false,
              },
            },
          },
        },
      },
    },
    responses: {},
  },
};
