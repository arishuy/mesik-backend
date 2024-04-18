export default {
  get: {
    tags: ["user"],
    operationId: "getUserInfo",
    description: "get current user info",
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {},
  },
};
