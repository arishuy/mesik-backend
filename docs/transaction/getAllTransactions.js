export default {
  get: {
    tags: ["transaction"],
    operationId: "getAllTransactions",
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
        description: "The number of transactions in one page",
      },
      {
        name: "date_from",
        in: "query",
        schema: {
          type: "string",
        },
      },
      {
        name: "date_to",
        in: "query",
        schema: {
          type: "string",
        },
      },
      {
        name: "transaction_status",
        in: "query",
        schema: {
          type: "string",
        },
        description: '["PROCESSING", "CANCELED", "DONE"]',
      },
    ],
    responses: {},
  },
};
