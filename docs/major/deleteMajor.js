export default {
  delete: {
    tags: ["major"],
    operationId: "deleteMajor",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "major_id",
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
