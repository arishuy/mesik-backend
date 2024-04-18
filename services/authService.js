import { User } from "../models/index.js";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import { userMapper } from "./mapper/userMapper.js";
import crypto from "crypto";
import sendMail from "../utils/sendMail.js";

const createNewUser = async (user) => {
  if (await User.findOne({ email: user.email.toLowerCase() })) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists.");
  }
  if (await User.findOne({ username: user.username.toLowerCase() })) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username already exists.");
  }
  const encrypted_password = await bcrypt.hash(
    user.password,
    parseInt(process.env.BCRYPT_SALT)
  );
  const newUser = await User.create({ ...user, encrypted_password });
  if (!newUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Server error");
  }
  return userMapper(newUser);
};

const fetchUserByUsernameAndPassword = async ({ username, password }) => {
  const user = await User.findOne({
    username: username,
  }).lean();
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid credentials");
  }

  let passwordMatches = await bcrypt.compare(password, user.encrypted_password);
  if (!passwordMatches) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid credentials");
  }
  return userMapper(user);
};

const fetchUserByEmail = async ({ email }) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  }).lean();
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid credentials");
  }

  return userMapper(user);
};

const verifyUserFromTokenPayload = async ({ user_id }) => {
  if (!(await User.findById(user_id))) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid token");
  }
};

const resetPassword = async ({ username, email }) => {
  const user = await User.findOne({ username: username, email: email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  const reset_password = crypto.randomBytes(4).toString("hex");
  const encrypted_reset_password = await bcrypt.hash(
    reset_password,
    parseInt(process.env.BCRYPT_SALT)
  );
  user.encrypted_password = encrypted_reset_password;
  user.reset_password = reset_password;
  await user.save();

  sendMail({
    template: "resetPasswordEmail",
    templateVars: {
      resetPassword: reset_password,
    },
    to: user.email,
    subject: "Reset password",
  });
};

const handleGoogleUser = async (google_user) => {
  const user = await User.findOne({ email: google_user.email }).lean();
  if (user) {
    if (!user.providers || !user.providers.includes("google")) {
      // TODO: handle old user with new google auth

      await User.findByIdAndUpdate(user._id, {
        $push: { providers: "google" },
      });
    }
    updateLastLoginTime(user._id)
    return userMapper(user);
  }

  const password = crypto.randomBytes(4).toString("hex");
  const encrypted_password = await bcrypt.hash(
    password,
    parseInt(process.env.BCRYPT_SALT)
  );

  const newUser = await User.create({
    first_name: google_user.given_name,
    last_name: google_user.family_name,
    photo_url: google_user.picture,
    email: google_user.email,
    isConfirmed: true,
    isRestricted: false,
    providers: ["google"],
    username: google_user.email,
    encrypted_password
  });

  sendMail({
    template: "newGoogleUserEmail",
    templateVars: {
      username: google_user.email,
      password: password
    },
    to: google_user.email,
    subject: "New Account",
  });

  return userMapper(newUser);
};

const updateLastLoginTime = async (user_id) => {
  await User.updateOne(
    { _id: user_id },
    {
      lastLoginTime: Date.now(),
    }
  );
};

export default {
  createNewUser,
  fetchUserByUsernameAndPassword,
  fetchUserByEmail,
  verifyUserFromTokenPayload,
  resetPassword,
  handleGoogleUser,
  updateLastLoginTime,
};
