export default {
  get: {
    tags: ["expert"],
    operationId: "getCurrentExpertMajors",
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {},
  },
};
