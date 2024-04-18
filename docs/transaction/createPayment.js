export default {
  post: {
    tags: ["transaction"],
    operationId: "createPayment",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              job_request_id: {
                type: "string",
                require: true,
              },
            },
          },
        },
      },
    },
    responses: {},
  },
};
