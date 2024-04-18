export default {
    get: {
      tags: ["expert"],
      operationId: "getAllWithdrawalRequestForCurrentExpert",
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
  