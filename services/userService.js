import { User, Major, ExpertInfo, Artist } from "../models/index.js";
import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import { userMapper } from "./mapper/userMapper.js";
import cloudinaryService from "./cloudinaryService.js";
import { roles } from "../config/constant.js";

import dotenv, { populate } from "dotenv";

dotenv.config();

const fetchUserById = async (user_id) => {
  const user = await User.findById(user_id).lean();
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  return userMapper(user);
};

const fetchUsersPagination = async (page = 1, limit = 10) => {
  const pagination = await User.paginate(
    { deleted: false },
    {
      select:
        "first_name last_name gender phone address photo_url DoB email username role isRestricted isConfirmed",
      page,
      limit,
      lean: true,
      customLabels: {
        docs: "users",
      },
    }
  );
  return pagination;
};

const changePasswordByUserId = async ({
  user_id,
  current_password,
  new_password,
  confirm_password,
}) => {
  if (new_password !== confirm_password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Confirmation password not match"
    );
  }

  const user = await User.findById(user_id);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  let current_passwordMatches = await bcrypt.compare(
    current_password,
    user.encrypted_password
  );
  if (!current_passwordMatches) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid credentials");
  }

  const encrypted_new_password = await bcrypt.hash(
    new_password,
    parseInt(process.env.BCRYPT_SALT)
  );
  await user.updateOne({ encrypted_password: encrypted_new_password });

  return userMapper(user);
};

const updateUserInfo = async (user_id, update_info) => {
  const user = await User.findById(user_id);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  user.first_name = update_info.first_name || user.first_name;
  user.last_name = update_info.last_name || user.last_name;
  user.gender = update_info.gender || user.gender;
  user.phone = update_info.phone || user.phone;
  if (update_info.file) {
    // upload image and retrieve photo_url
    const response = await cloudinaryService.upload(update_info.file);
    if (user.photo_public_id) {
      // delete old image async
      cloudinaryService.deleteByPublicId(user.photo_public_id);
    }
    user.photo_url = response.url;
    user.photo_public_id = response.public_id;
  }
  user.DoB = update_info.DoB ? new Date(update_info.DoB) : user.DoB;
  await user.save();
  return userMapper(user);
};

const initAdmin = async () => {
  let admin = await User.findOne({
    username: process.env.ADMIN_USERNAME,
    role: roles.ADMIN,
  });
  if (!admin) {
    admin = await User.findOneAndUpdate(
      { username: process.env.ADMIN_USERNAME },
      {
        email: process.env.ADMIN_EMAIL,
        encrypted_password: await bcrypt.hash(
          process.env.ADMIN_PASSWORD,
          parseInt(process.env.BCRYPT_SALT)
        ),
        role: roles.ADMIN,
        isRestricted: false,
        isConfirmed: true,
      },
      {
        upsert: true,
      }
    );
  }

  return admin;
};

const promoteToExpert = async ({ user_id, descriptions }) => {
  let user = User.findById(user_id);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  let expertInfo = await ExpertInfo.create({
    user: user_id,
    descriptions: descriptions,
  });
  await user.updateOne({
    role: roles.EXPERT,
  });
  await expertInfo.populate("user", "first_name last_name role");
  return expertInfo;
};

const promoteToArtist = async ({ user_id, descriptions }) => {
  let user = User.findById(user_id);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  let artist = await Artist.create({
    user: user_id,
    descriptions: descriptions,
    albums: [],
    songs: [],
  });
  await user.updateOne({
    role: roles.ARTIST,
  });
  await artist.populate("user", "first_name last_name role");
  return artist;
};

const enableUserById = async (user_id) => {
  const user = await User.findByIdAndUpdate(
    user_id,
    { isRestricted: false },
    { new: true }
  );
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  return userMapper(user);
};

const disableUserById = async (user_id) => {
  const user = await User.findByIdAndUpdate(
    user_id,
    { isRestricted: true },
    { new: true }
  );
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  return userMapper(user);
};

const confirmUserById = async (user_id) => {
  const user = await User.findByIdAndUpdate(
    user_id,
    { isConfirmed: true },
    { new: true }
  );
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  return userMapper(user);
};

const deleteUserById = async (user_id) => {
  const user = await User.findById(user_id);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  if (user.role === roles.ADMIN) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't delete an admin");
  }
  await user.delete();
};

const getHistoryListen = async (user_id) => {
  const user = await User.findById(user_id)
    .populate({
      path: "history_listen",
      select: "title photo_url file play_count artist",
      populate: {
        path: "artist",
        select: "user",
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      },
    })
    .limit(6);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  return user.history_listen;
};

export default {
  fetchUserById,
  fetchUsersPagination,
  changePasswordByUserId,
  updateUserInfo,
  initAdmin,
  promoteToExpert,
  promoteToArtist,
  enableUserById,
  disableUserById,
  confirmUserById,
  deleteUserById,
  getHistoryListen,
};
