export default {
  post: {
    tags: ["review"],
    operationId: "createReview",
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
              rating: {
                type: "number",
                require: true,
              },
              comment: {
                type: "string",
              },
            },
          },
        },
      },
    },
    responses: {},
  },
};
