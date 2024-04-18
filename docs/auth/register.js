export default {
  post: {
    tags: ["auth"],
    operationId: "register",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/RegisterRequest",
          },
        },
      },
    },
    responses: {
      200: {
        description: "register successfully",
      },
    },
  },
};
