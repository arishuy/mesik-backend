export default {
  get: {
    tags: ["user"],
    operationId: "getAllUsers",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "page",
        in: "query",
        schema: {
          type: "integer",
        },
      },
      {
        name: "limit",
        in: "query",
        schema: {
          type: "integer",
        },
        description: "The number of users in one page",
      },
    ],
    responses: {},
  },
};
