export default {
  get: {
    tags: ["report"],
    operationId: "getReportById",
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
