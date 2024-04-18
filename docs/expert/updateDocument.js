export default {
  put: {
    tags: ["expert"],
    operationId: "updateDocument",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "expert_id",
        in: "path",
        schema: {
          type: "string",
        },
        require: true,
      },
      {
        name: "document_id",
        in: "path",
        schema: {
          type: "string",
        },
        require: true,
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              description: {
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
