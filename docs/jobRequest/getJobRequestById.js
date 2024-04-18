export default {
  get: {
    tags: ["job_request"],
    operationId: "getJobRequestById",
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
