export default {
  post: {
    tags: ["auth"],
    operationId: "refreshToken",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/RefreshToken",
          },
        },
      },
    },
    responses: {},
  },
};
