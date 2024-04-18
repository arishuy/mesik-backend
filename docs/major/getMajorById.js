export default {
  get: {
    tags: ["major"],
    operationId: "getMajor",
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
