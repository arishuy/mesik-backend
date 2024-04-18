import authSchemas from "./auth/schemas.js";

export default {
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ...authSchemas,
      user: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          first_name: {
            type: "string",
          },
          last_name: {
            type: "string",
          },
          photo_url: {
            type: "string",
          },
          email: {
            type: "string",
          },
          username: {
            type: "string",
          },
          role: {
            type: "string",
          },
          isRestriced: {
            type: "bool",
          },
        },
      },
      address: {
        type: "object",
        properties: {
          city: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              code: {
                type: "number",
              },
            },
          },
          district: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              code: {
                type: "number",
              },
            },
          },
          ward: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              code: {
                type: "number",
              },
            },
          },
          other_detail: {
            type: "string",
          },
        },
      },
    },
  },
};
