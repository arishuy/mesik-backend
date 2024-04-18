export default {
  get: {
    tags: ["expert"],
    operationId: "getRecommendedJobRequest",
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
        description: "The number of reviews in one page",
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
