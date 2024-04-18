export default {
  put: {
    tags: ["user"],
    operationId: "updateUserInfoById",
    description: "update user by id",
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
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              first_name: {
                type: "string",
              },
              last_name: {
                type: "string",
              },
              gender: {
                type: "boolean",
              },
              phone: {
                type: "string",
              },
              address: {
                $ref: "#/components/schemas/address",
              },
              DoB: {
                type: "string",
              },
              photo: {
                type: "file",
              },
            },
          },
        },
      },
    },
    responses: {},
  },
};
