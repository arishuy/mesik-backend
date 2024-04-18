export default {
  get: {
    tags: ["user"],
    operationId: "getUserInfoById",
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
