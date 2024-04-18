import yup from "yup";

const schemas = {
  registerSchema: yup.object({
    body: yup.object({
      first_name: yup.string().required(),
      last_name: yup.string().required(),
      email: yup.string().email().required(),
      username: yup.string().required(),
      password: yup
        .string()
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"
        ),
    }),
  }),

  loginSchema: yup.object({
    body: yup.object({
      username: yup.string().required(),
      password: yup.string().required(),
    }),
  }),

  logoutSchema: yup.object({
    body: yup.object({
      refresh_token: yup.string().required(),
    }),
  }),

  refreshTokenSchema: yup.object({
    body: yup.object({
      refresh_token: yup.string().required(),
    }),
  }),

  activateSchema: yup.object({
    params: yup.object({
      token: yup.string().required(),
    }),
  }),

  resetPasswordSchema: yup.object({
    body: yup.object({
      username: yup.string().required(),
      email: yup.string().email().required(),
    }),
  }),
};

export default schemas;
