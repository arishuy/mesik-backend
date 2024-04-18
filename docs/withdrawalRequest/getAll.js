export default {
    get: {
      tags: ["withdrawal-request"],
      operationId: "getAllWithdrawalRequest",
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
  