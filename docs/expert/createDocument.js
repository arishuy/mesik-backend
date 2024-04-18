export default {
  post: {
    tags: ["expert"],
    operationId: "createDocument",
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
    ],
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              description: {
                type: "string",
              },
              file: {
                type: "file",
              },
            },
          },
        },
      },
    },
    responses: {},
  },
};
