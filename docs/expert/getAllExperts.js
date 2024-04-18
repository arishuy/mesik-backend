export default {
  get: {
    tags: ["expert"],
    operationId: "getAllExperts",
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
        description: "The number of experts in one page",
      },
      {
        name: "search",
        in: "query",
        schema: {
          type: "string",
        },
        description: "Search by full name: fisrt_name + ' ' + last_name",
      },
      {
        name: "major_id",
        in: "query",
        schema: {
          type: "string",
        },
        description: "Filter by major",
      },
    ],
    responses: {},
  },
};
