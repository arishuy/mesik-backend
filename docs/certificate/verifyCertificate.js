export default {
  put: {
    tags: ["certificate"],
    operationId: "verifyCertificate",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "certificate_id",
        in: "path",
        schema: {
          type: "string",
        },
        require: true,
      },
    ],
    responses: {},
  },
};
