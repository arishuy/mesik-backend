export default {
  RegisterRequest: {
    type: "object",
    properties: {
      first_name: {
        type: "string",
      },
      last_name: {
        type: "string",
      },
      email: {
        type: "string",
      },
      username: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
  },
  LoginRequest: {
    type: "object",
    properties: {
      username: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
  },
  RefreshToken: {
    type: "object",
    properties: {
      refresh_token: {
        type: "string",
      },
    },
  },
};
