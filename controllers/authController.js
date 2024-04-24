import authService from "../services/authService.js";
import tokenService from "../services/tokenService.js";
import confirmationUserService from "../services/confirmationUserService.js";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import dotenv from "dotenv";
import Artist from "../models/Artist.js";

dotenv.config();

const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, username, password } = req.body;
    const newUser = await authService.createNewUser({
      first_name,
      last_name,
      email,
      username,
      password,
    });
    confirmationUserService.createConfirmationTokenAndSendMail(newUser._id);
    const tokens = await tokenService.generateAuthTokens(newUser);
    res.json({
      user: newUser,
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    let artist = null;
    const { username, password } = req.body;
    const user = await authService.fetchUserByUsernameAndPassword({
      username,
      password,
    });
    if (user.role === "ARTIST") {
      artist = await Artist.findOne({ user: user._id });
      user.artist = artist._id;
    }
    await authService.updateLastLoginTime(user._id);
    const tokens = await tokenService.generateAuthTokens(user);
    res.json({
      user,
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    await tokenService.clearRefreshToken(refresh_token);
    res.json({});
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    const payload = await tokenService.verifyRefreshToken(refresh_token);
    await authService.verifyUserFromTokenPayload(payload);
    let newAccessToken =
      await tokenService.generateAccessTokenFromRefreshTokenPayload(payload);
    res.json({ access_token: newAccessToken });
  } catch (error) {
    next(error);
  }
};

const activate = async (req, res, next) => {
  try {
    const token = req.params.token;
    await confirmationUserService.enableUserByConfirmationToken(token);
    res.json({ message: "Activated account" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    await authService.resetPassword({ username, email });
    res.json({ message: "Email sent" });
  } catch (error) {
    next(error);
  }
};

// Google auth

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

const verifyGoogleToken = async (token) => {
  try {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: [process.env.CLIENT_ID, process.env.CLIENT_ID_ANDROID],
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    throw error;
  }
};

const googleLogin = async (req, res, next) => {
  try {
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        throw verificationResponse.error;
      }

      const profile = verificationResponse?.payload;
      const user = await authService.handleGoogleUser(profile);
      const tokens = await tokenService.generateAuthTokens(user);

      res.json({ user, tokens });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  logout,
  refreshToken,
  activate,
  resetPassword,
  googleLogin,
};
