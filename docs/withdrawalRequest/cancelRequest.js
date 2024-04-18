export default {
    post: {
      tags: ["withdrawal-request"],
      operationId: "cancelWithdrawalRequest",
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
  