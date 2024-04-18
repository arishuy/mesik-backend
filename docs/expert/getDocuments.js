export default {
  get: {
    tags: ["expert"],
    operationId: "getDocuments",
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
    responses: {},
  },
};
