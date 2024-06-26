import {
  User,
  Major,
  ExpertInfo,
  Artist,
  Listening,
  Song,
  Request,
  Transaction,
  PremiumPackage,
} from "../models/index.js";
import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import { userMapper } from "./mapper/userMapper.js";
import cloudinaryService from "./cloudinaryService.js";
import {
  roles,
  transaction_status,
  transaction_types,
} from "../config/constant.js";

import dotenv, { populate } from "dotenv";

dotenv.config();

const fetchUserById = async (user_id) => {
  const user = await User.findById(user_id).lean();
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  return userMapper(user);
};

const fetchUsersPagination = async (
  page = 1,
  limit = 10,
  role = "all",
  name = ""
) => {
  const pagination = await User.paginate(
    {
      deleted: false,
      role:
        role === "all"
          ? { $in: [roles.USER, roles.EXPERT, roles.ARTIST] }
          : role,
      $or: [
        { first_name: { $regex: name, $options: "i" } },
        { last_name: { $regex: name, $options: "i" } },
      ],
    },
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
  user.role = update_info.role || user.role;
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

const promoteToArtist = async ({
  user_id,
  descriptions,
  display_name = "",
}) => {
  let user = User.findById(user_id);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  let artist = await Request.create({
    user: user_id,
    status: "PENDING",
    reason: "",
    descriptions: descriptions,
    display_name:
      display_name === "" ? user.first_name + user.last_name : display_name,
  });

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
  const user = await User.findById(user_id).populate({
    path: "history_listen",
    select: "title photo_url file play_count artist duration isPremium lyric",
    populate: [
      {
        path: "artist",
        select: "user display_name",
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      },
      {
        path: "featuredArtists",
        select: "user display_name",
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      },
    ],
  });
  // Lấy 6 phần tử của mảng history_listen
  const historyListen = user.history_listen.slice(0, 6);

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  return historyListen;
};

const getHistoryListenPagination = async (user_id, page = 1, limit = 10) => {
  // Find the user by ID and select the history_listen field
  const user = await User.findById(user_id).select("history_listen").lean();

  // Check if user exists
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  // Paginate the history_listen array
  const paginatedHistoryListen = user.history_listen.slice(
    (page - 1) * limit,
    page * limit
  );

  // Fetch the songs based on the paginated history
  const songs = await Song.find({
    _id: { $in: paginatedHistoryListen },
  })
    .populate({
      path: "artist",
      select: "user display_name",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    })
    .populate({
      path: "featuredArtists",
      select: "user display_name",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    });

  // Sort the fetched songs based on the order of IDs in paginatedHistoryListen
  const sortedSongs = paginatedHistoryListen.map((songId) =>
    songs.find((song) => song._id.toString() === songId.toString())
  );

  return sortedSongs;
};

const addOrRemoveSongToLikedSong = async (user_id, song_id) => {
  const user = await User.findById(user_id);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  const song = await Song.findById(song_id);
  if (!song) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Song not found");
  }
  if (user.liked_songs.includes(song_id)) {
    user.liked_songs.pull(song_id);
    await user.save();
    return {
      message: "Removed song from liked songs successfully",
      favourite: false,
    };
  } else {
    user.liked_songs.push(song_id);
    await user.save();
    return {
      message: "Added song to liked songs successfully",
      favourite: true,
    };
  }
};

const getLikedSongs = async (user_id) => {
  const user = await User.findById(user_id).populate({
    path: "liked_songs",
    select: "title photo_url file play_count artist duration isPremium lyric",
    populate: [
      {
        path: "artist",
        select: "user display_name",
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      },
      {
        path: "featuredArtists",
        select: "user display_name",
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      },
    ],
  });

  return user.liked_songs;
};

const getMyRequest = async (user_id) => {
  const requests = await Request.find({ user: user_id });
  return requests;
};

const followArtist = async (user_id, artist_id) => {
  const artist = await Artist.findOne({ _id: artist_id });
  if (!artist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Artist not found");
  }
  const user = await User.findById(user_id);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  if (user.following.includes(artist_id)) {
    user.following.pull(artist_id);
    await user.save();

    artist.followers.pull(user_id);
    await artist.save();
    return {
      totalFollow: artist.followers.length,
      isFollow: false,
    };
  }
  user.following.push(artist_id);
  await user.save();

  artist.followers.push(user_id);
  await artist.save();

  return {
    totalFollow: artist.followers.length,
    isFollow: true,
  };
};

const getFollowing = async (user_id) => {
  const user = await User.findById(user_id).populate({
    path: "following",
    select: "display_name",
    populate: {
      path: "user",
      select: "first_name last_name photo_url",
    },
  });
  return user.following;
};

const buyPremiumPackage = async (user_id, premiumPackage_id) => {
  const user = await User.findById(user_id);
  const premiumPackage = await PremiumPackage.findById(premiumPackage_id);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  if (!premiumPackage) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Premium package not found");
  }
  if (user.balance < premiumPackage.price) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Not enough balance");
  }
  user.balance -= premiumPackage.price;
  if (!user.premiumStartDate) user.premiumStartDate = new Date();
  if (!user.premiumEndDate) user.premiumEndDate = new Date();
  user.premiumEndDate = new Date(
    user.premiumEndDate.getTime() +
      premiumPackage.durationMonths * 30 * 24 * 60 * 60 * 1000
  );
  await user.save();

  // create transaction
  const transaction = await Transaction.create({
    user: user_id,
    amount: premiumPackage.price,
    transaction_type: transaction_types.BUY_PREMIUM,
    transaction_status: transaction_status.DONE,
  });
  return user;
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
  addOrRemoveSongToLikedSong,
  getLikedSongs,
  getMyRequest,
  followArtist,
  getFollowing,
  getHistoryListenPagination,
  buyPremiumPackage,
};
