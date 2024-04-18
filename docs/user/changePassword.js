export default {
  put: {
    tags: ["user"],
    operationId: "changePassword",
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              current_password: {
                type: "string",
                require: true,
              },
              new_password: {
                type: "string",
                require: true,
              },
              confirm_password: {
                type: "string",
                require: true,
              },
            },
          },
        },
      },
    },
    responses: {},
  },
};
