export default {
  delete: {
    tags: ["expert"],
    operationId: "deleteRecommendedJobRequest",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "job_request_id",
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
