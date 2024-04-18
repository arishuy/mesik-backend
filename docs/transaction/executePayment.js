export default {
  post: {
    tags: ["transaction"],
    operationId: "executePayment",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "transaction_id",
        in: "path",
        schema: {
          type: "string",
        },
        require: true,
      },
    ],
    responses: {},
  },
};
