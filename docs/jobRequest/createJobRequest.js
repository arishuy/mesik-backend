export default {
  post: {
    tags: ["job_request"],
    operationId: "createJobRequest",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [],
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
      200: {
        description: "register successfully",
      },
    },
  },
};
