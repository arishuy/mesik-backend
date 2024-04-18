export default {
  put: {
    tags: ["expert"],
    operationId: "updateBankAccount",
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
              number: {
                type: "string",
              },
              owner_name: {
                type: "string",
              },
              bank_name: {
                type: "string",
              },
            },
          },
        },
      },
    },
    responses: {},
  },
};
