export default {
  get: {
    tags: ["expert"],
    operationId: "getUserInfo",
    description: "get current expert info",
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {},
  },
};
