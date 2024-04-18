export default {
  post: {
    tags: ["report"],
    operationId: "createReport",
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              title: {
                type: "string",
              },
              description: {
                type: "string",
              },
              photo: {
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
