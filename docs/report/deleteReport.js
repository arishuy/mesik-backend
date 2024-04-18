export default {
  delete: {
    tags: ["report"],
    operationId: "deleteReport",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "report_id",
        in: "path",
        schema: {
          type: "string",
        },
      },
    ],
    responses: {},
  },
};
