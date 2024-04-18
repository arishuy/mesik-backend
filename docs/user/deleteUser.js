export default {
  delete: {
    tags: ["user"],
    operationId: "deleteUser",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "user_id",
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
