export default {
  post: {
    tags: ["auth"],
    operationId: "logout",
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
