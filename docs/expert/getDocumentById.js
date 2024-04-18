export default {
  get: {
    tags: ["expert"],
    operationId: "getDocumentById",
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
    responses: {},
  },
};
