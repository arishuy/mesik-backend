export default {
  get: {
    tags: ["expert"],
    operationId: "getAcceptedJobRequests",
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
