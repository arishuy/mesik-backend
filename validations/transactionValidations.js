import yup from "yup";
import dotenv from "dotenv";

dotenv.config();

const schemas = {
  depositSchema: yup.object({
    body: yup.object({
      amount: yup
        .number()
        .required()
        .min(0)
        .max(+process.env.DEPOSIT_AMOUNT_MAX),
    }),
  }),
};

export default schemas;
