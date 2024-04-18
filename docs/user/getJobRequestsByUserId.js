export default {
  get: {
    tags: ["user"],
    operationId: "getJobRequests",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "user_id",
        in: "path",
        schema: {
          type: "string",
        },
        require: true,
      },
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
        description: "The number of job requests in one page",
      },
      {
        name: "major_id",
        in: "query",
        schema: {
          type: "string",
        },
      },
    ],
    responses: {},
  },
};
