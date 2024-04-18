import { sign, verify } from "../utils/jwtHelper.js";
import { RefreshToken } from "../models/index.js";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import moment from "moment/moment.js";
import { tokenTypes } from "../config/constant.js";
import userService from "./userService.js";

const generateToken = async (user_id, login_time, exp, type) => {
  const payload = {
    user_id,
    login_time: new Date(login_time.valueOf()).toISOString(),
    exp: exp.unix(),
    type,
  };
  let token = await sign(payload, process.env.JWT_SECRET);
  return token;
};

const saveRefreshToken = async (user_id, login_time, token) => {
  await RefreshToken.findOneAndUpdate(
    { user_id: user_id },
    {
      login_time: new Date(login_time.valueOf()).toISOString(),
      token: token,
    },
    {
      upsert: true,
    }
  );
};

const clearRefreshToken = async (token) => {
  await RefreshToken.findOneAndDelete({ token: token });
};

const generateAuthTokens = async (user) => {
  const login_time = moment();
  let accessTokenExpiresAt = login_time
    .clone()
    .add(process.env.ACCESS_TOKEN_EXPIRATION_MINUTES, "minutes");

  const access_token = await generateToken(
    user._id,
    login_time,
    accessTokenExpiresAt,
    tokenTypes.ACCESS
  );

  let refreshTokenExpireAt = login_time
    .clone()
    .add(process.env.REFRESH_TOKEN_EXPIRATION_DAYS, "days");

  const refresh_token = await generateToken(
    user._id,
    login_time,
    refreshTokenExpireAt,
    tokenTypes.REFRESH
  );

  await saveRefreshToken(user._id, login_time, refresh_token);
  return {
    access_token,
    refresh_token,
  };
};

const generateAccessTokenFromRefreshTokenPayload = async ({
  user_id,
  login_time,
}) => {
  const now = moment();
  let accessTokenExpiresAt = now
    .clone()
    .add(process.env.ACCESS_TOKEN_EXPIRATION_MINUTES, "minutes");

  const accessToken = await generateToken(
    user_id,
    moment(login_time),
    accessTokenExpiresAt,
    tokenTypes.ACCESS
  );

  return accessToken;
};

const verifyRefreshToken = async (token) => {
  let tokenPayload = await verify(token, process.env.JWT_SECRET);
  if (!tokenPayload || tokenPayload.type != tokenTypes.REFRESH) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token");
  }

  if (!(await RefreshToken.exists({ token: token }))) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token");
  }

  return tokenPayload;
};

const verifyAccessToken = async (token) => {
  let tokenPayload = await verify(token, process.env.JWT_SECRET);
  if (!tokenPayload || tokenPayload.type != tokenTypes.ACCESS) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid access token");
  }

  const user = await userService.fetchUserById(tokenPayload.user_id);
  if (!user) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid access token");
  }

  let refreshTokenExists = await RefreshToken.exists({
    user_id: user._id,
    login_time: tokenPayload.login_time,
  });
  if (!refreshTokenExists) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid access token");
  }

  return user;
};

export default {
  clearRefreshToken,
  generateAuthTokens,
  generateAccessTokenFromRefreshTokenPayload,
  verifyRefreshToken,
  verifyAccessToken,
};
