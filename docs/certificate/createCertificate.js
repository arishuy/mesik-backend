export default {
  post: {
    tags: ["certificate"],
    operationId: "createCertificate",
    description: "add new certificate to current expert",
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
              name: {
                type: "string",
              },
              major_id: {
                type: "string",
              },
              descriptions: {
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
