import yup from "yup";
import parse from "date-fns/parse/index.js";

const schemas = {
  updateUserInfoSchema: yup.object({
    body: yup.object({
      first_name: yup
        .string()
        .nullable()
        .transform((curr, orig) => (orig === "" ? null : curr)),
      last_name: yup
        .string()
        .nullable()
        .transform((curr, orig) => (orig === "" ? null : curr)),
      gender: yup
        .boolean()
        .nullable()
        .transform((curr, orig) => (orig === "" ? null : curr)),
      phone: yup
        .string()
        .nullable()
        .transform((curr, orig) => (orig === "" ? null : curr))
        .matches(
          /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
          "not a valid Vietnam phone number"
        ),
    }),
  }),

  changePasswordSchema: yup.object({
    body: yup.object({
      current_password: yup.string().required(),
      new_password: yup
        .string()
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"
        ),
      confirm_password: yup
        .string()
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"
        ),
    }),
  }),
};

export default schemas;
