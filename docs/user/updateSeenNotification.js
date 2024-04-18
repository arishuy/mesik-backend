export default {
  put: {
    tags: ["user"],
    operationId: "updateSeenNotification",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        name: "notification_id",
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
