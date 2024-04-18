import { ConfirmationToken } from "../models/index.js";
import userService from "./userService.js";
import sendMail from "../utils/sendMail.js";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import dotenv from "dotenv";

dotenv.config();

const createConfirmationTokenAndSendMail = async (user_id) => {
  const user = await userService.fetchUserById(user_id);

  const confirmationToken = await ConfirmationToken.create({
    user_id: user_id,
    token: uuidv4(),
  });

  // send confirmation email async
  sendMail({
    template: "activationEmail",
    templateVars: {
      activationUrl: `${process.env.EMAIL_CONFIRMATION_URL}/${confirmationToken.token}`,
    },
    to: user.email,
    subject: "Email confirmation",
    callback: async () => {
      await confirmationToken.updateOne({ confirmation_sent_at: Date.now() });
    },
  });
};

const enableUserByConfirmationToken = async (token) => {
  const confirmationToken = await ConfirmationToken.findOne({ token: token });
  if (!confirmationToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid confirmation token");
  }
  await userService.confirmUserById(confirmationToken.user_id);
  await confirmationToken.updateOne({ confirm_at: Date.now() });
};

export default {
  createConfirmationTokenAndSendMail,
  enableUserByConfirmationToken,
};
