import userService from "../services/userService.js";
import jobRequestService from "../services/jobRequestService.js";
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
    const { page, limit } = req.query;
    const pagination = await userService.fetchUsersPagination(
      page || 1,
      limit || 10
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

const promoteToExpert = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { descriptions } = req.body;
    const expert = await userService.promoteToExpert({
      user_id,
      descriptions,
    });
    res.json({ expert });
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

const getJobRequestsPaginationOfCurrentUser = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { page, limit, major_id } = req.query;
    const pagination =
      await jobRequestService.fetchJobRequestsPaginationByUserId(
        user_id,
        page || 1,
        limit || 10,
        major_id
      );
    res.json({ pagination });
  } catch (error) {
    next(error);
  }
};

const getJobRequestsPaginationByUserId = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { page, limit, major_id } = req.query;
    const pagination =
      await jobRequestService.fetchJobRequestsPaginationByUserId(
        user_id,
        page || 1,
        limit || 10,
        major_id
      );
    res.json({ pagination });
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

export default {
  getUserById,
  getUsersPagination,
  changePassword,
  getCurrentUserInfo,
  updateUserInfo,
  promoteToExpert,
  enableUser,
  disableUser,
  updateUserInfoById,
  deleteUser,
  getJobRequestsPaginationOfCurrentUser,
  getJobRequestsPaginationByUserId,
  getCurrentUserTransactions,
  getCurrentUserNotifications,
  updateSeenNotification,
};
