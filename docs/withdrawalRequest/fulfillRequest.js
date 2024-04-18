export default {
    post: {
      tags: ["withdrawal-request"],
      operationId: "fulfillWithdrawalRequest",
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
  