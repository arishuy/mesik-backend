export default {
  post: {
    tags: ["auth"],
    operationId: "login",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/LoginRequest",
          },
        },
      },
    },
    responses: {
      200: {
        description: "login successfully",
      },
    },
  },
};
