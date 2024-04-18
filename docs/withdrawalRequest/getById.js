export default {
    get: {
      tags: ["withdrawal-request"],
      operationId: "getAllWithdrawalRequestById",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
            name: "id",
            in: "path",
            schema: {
              type: "string",
            },
          },
      ],
      responses: {},
    },
  };
  