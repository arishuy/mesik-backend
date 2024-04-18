export default {
  get: {
    tags: ["report"],
    operationId: "getReports",
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
      },
    ],
    responses: {},
  },
};
