export default {
  put: {
    tags: ["job_request"],
    operationId: "updateJobRequest",
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
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              major_id: {
                type: "string",
                require: true,
              },
              title: {
                type: "string",
                require: true,
              },
              descriptions: {
                type: "string",
                require: true,
              },
              address: {
                $ref: "#/components/schemas/address",
              },
              price: {
                type: "number",
                require: true,
              },
            },
          },
        },
      },
    },
    responses: {
      200: {},
    },
  },
};
