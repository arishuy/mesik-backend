import userService from "../services/userService.js";
import transactionService from "../services/transactionService.js";
import notificationService from "../services/notificationService.js";
const getUserById = async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const user = await userService.fetchUserById(user_id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const getUsersPagination = async (req, res, next) => {
  try {
    const { page, limit, role, name } = req.query;
    const pagination = await userService.fetchUsersPagination(
      page || 1,
      limit || 10,
      role,
      name
    );
    res.json({ pagination });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { current_password, new_password, confirm_password } = req.body;
    await userService.changePasswordByUserId({
      user_id,
      current_password,
      new_password,
      confirm_password,
    });
    res.json({ message: "Changed password successfully" });
  } catch (error) {
    next(error);
  }
};

const getCurrentUserInfo = async (req, res, next) => {
  try {
    res.json({ user: req.authData.user });
  } catch (error) {
    next(error);
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const update_info = { ...req.body, file: req.file || undefined };
    const user_id = req.authData.user._id;
    const updated_user = await userService.updateUserInfo(user_id, update_info);
    res.json({ user: updated_user });
  } catch (error) {
    next(error);
  }
};

const updateUserInfoById = async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const update_info = { ...req.body, file: req.file || undefined };
    const updated_user = await userService.updateUserInfo(user_id, update_info);
    res.json({ user: updated_user });
  } catch (error) {
    next(error);
  }
};

const promoteToArtist = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { descriptions, display_name } = req.body;
    const artist = await userService.promoteToArtist({
      user_id,
      descriptions,
      display_name,
    });
    res.json({ artist });
  } catch (error) {
    next(error);
  }
};
const enableUser = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    const user = await userService.enableUserById(user_id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const disableUser = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    const user = await userService.disableUserById(user_id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    await userService.deleteUserById(user_id);
    res.json({ message: "Delete user successfully" });
  } catch (error) {
    next(error);
  }
};

const getCurrentUserTransactions = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { page, limit, date_from, date_to, transaction_status } = req.query;
    const transactions = await transactionService.fetchTransactionsByUserId(
      user_id,
      page || 1,
      limit || 10,
      date_from,
      date_to,
      transaction_status
    );
    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

const getCurrentUserNotifications = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { limit } = req.query;
    const notifications = await notificationService.fetchNotificationsByUserId(
      user_id,
      limit
    );
    res.json({ notifications });
  } catch (error) {
    next(error);
  }
};

const updateSeenNotification = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { notification_id } = req.params;
    const notification = await notificationService.updateSeenNotification(
      notification_id,
      user_id
    );
    res.json({ notification });
  } catch (error) {
    next(error);
  }
};

const getHistoryListen = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { limit } = req.query;
    if (limit) {
      const songs = await userService.getHistoryListenPagination(
        user_id,
        limit
      );
      return res.json({ songs });
    }
    const songs = await userService.getHistoryListen(user_id);
    res.json({ songs });
  } catch (error) {
    next(error);
  }
};

const addOrRemoveSongToLikedSong = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { song_id } = req.params;
    const result = await userService.addOrRemoveSongToLikedSong(
      user_id,
      song_id
    );
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

const getLikedSongs = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const songs = await userService.getLikedSongs(user_id);
    res.json({ songs });
  } catch (error) {
    next(error);
  }
};

const getMyRequest = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const request = await userService.getMyRequest(user_id);
    res.json({ request });
  } catch (error) {
    next(error);
  }
};

const followArtist = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { artist_id } = req.params;
    const result = await userService.followArtist(user_id, artist_id);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

const getFollowing = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const following = await userService.getFollowing(user_id);
    res.json({ following });
  } catch (error) {
    next(error);
  }
};

const buyPremiumPackage = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { premiumPackage_id } = req.params;
    const result = await userService.buyPremiumPackage(
      user_id,
      premiumPackage_id
    );
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

export default {
  getUserById,
  getUsersPagination,
  changePassword,
  getCurrentUserInfo,
  updateUserInfo,
  promoteToArtist,
  enableUser,
  disableUser,
  updateUserInfoById,
  deleteUser,
  getCurrentUserTransactions,
  getCurrentUserNotifications,
  updateSeenNotification,
  getHistoryListen,
  addOrRemoveSongToLikedSong,
  getLikedSongs,
  getMyRequest,
  followArtist,
  getFollowing,
  buyPremiumPackage,
};
