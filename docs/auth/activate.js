export default {
  get: {
    tags: ["auth"],
    operationId: "activate",
    parameters: [
      {
        name: "token",
        in: "path",
        schema: {
          type: "string",
        },
        require: true,
        description: "activation token",
      },
    ],
    responses: {},
  },
};
