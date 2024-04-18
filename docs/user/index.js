import getCurrentUserInfo from "./getCurrentUserInfo.js";
import updateUserInfo from "./updateUserInfo.js";
import changePassword from "./changePassword.js";
import getAllUsers from "./getAllUsers.js";
import promoteToExpert from "./promoteToExpert.js";
import getUserInfoById from "./getUserInfoById.js";
import enableUser from "./enableUser.js";
import disableUser from "./disableUser.js";
import updateUserInfoById from "./updateUserInfoById.js";
import deleteUser from "./deleteUser.js";
import getCurrentUserJobRequests from "./getCurrentUserJobRequests.js";
import getJobRequestsByUserId from "./getJobRequestsByUserId.js";
import getCurrentUserTransactions from "./getCurrentUserTransactions.js";
import getCurrentUserNotifications from "./getCurrentUserNotifications.js";
import updateSeenNotification from "./updateSeenNotification.js";

export default {
  "/users": {
    ...getAllUsers,
  },
  "/users/current": {
    ...getCurrentUserInfo,
    ...updateUserInfo,
  },
  "/users/current/password": {
    ...changePassword,
  },
  "/users/current/job_requests": {
    ...getCurrentUserJobRequests,
  },
  "/users/current/transactions": {
    ...getCurrentUserTransactions,
  },
  "/users/current/notifications": {
    ...getCurrentUserNotifications,
  },
  "/users/current/notifications/{notification_id}/seen": {
    ...updateSeenNotification,
  },
  "/users/current/promote-to-expert": {
    ...promoteToExpert,
  },
  "/users/{user_id}": {
    ...getUserInfoById,
    ...updateUserInfoById,
    ...deleteUser,
  },
  "/users/{user_id}/enable": {
    ...enableUser,
  },
  "/users/{user_id}/disable": {
    ...disableUser,
  },
  "/users/{user_id}/job_requests": {
    ...getJobRequestsByUserId,
  },
};
