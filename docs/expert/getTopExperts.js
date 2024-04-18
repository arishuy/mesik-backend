export default {
  get: {
    tags: ["expert"],
    operationId: "getTopExpert",
    parameters: [
      {
        name: "num",
        in: "query",
        schema: {
          type: "integer",
        },
        require: true,
      },
    ],
    responses: {},
  },
};
