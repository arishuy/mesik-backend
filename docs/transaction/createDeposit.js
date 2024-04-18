export default {
  post: {
    tags: ["transaction"],
    operationId: "createDeposit",
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
              amount: {
                type: "number",
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
