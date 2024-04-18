export default {
  put: {
    tags: ["user"],
    operationId: "disableUser",
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
