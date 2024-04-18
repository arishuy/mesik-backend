export default {
  delete: {
    tags: ["job_request"],
    operationId: "deleteJobRequest",
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
    responses: {
      200: {},
    },
  },
};
