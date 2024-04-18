export default {
  delete: {
    tags: ["expert"],
    operationId: "deleteDocument",
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
