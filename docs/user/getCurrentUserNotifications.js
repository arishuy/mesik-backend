export default {
  get: {
    tags: ["user"],
    operationId: "getCurrentUserNotifications",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "limit",
        in: "query",
        schema: {
          type: "integer",
        },
      },
    ],
    responses: {},
  },
};
