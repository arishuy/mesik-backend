export default {
  get: {
    tags: ["expert"],
    operationId: "getBankAccount",
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {},
  },
};
