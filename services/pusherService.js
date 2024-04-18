import { notification_types } from "../config/constant.js";
import { sendPushNotifications } from "../utils/pushNotification.js";
import pusher from "../utils/pusher.js";

const updateBalance = (user_id, balance) => {
  pusher.trigger(`user-${user_id}`, "update_balance", {
    balance: balance,
  });
};

const notify = async (notification) => {
  pusher.trigger(`user-${notification.user}`, "notification", {
    notification,
  });

  await pushNotification(notification.type, notification.ref, [notification.user])
};

const notifyMultipleUsers = async (notifications) => {
  if(notifications.length === 0) return;
  
  const user_ids = [];

  for (const notification of notifications) {
    user_ids.push(notification.user);
    pusher.trigger(`user-${notification.user}`, "notification", {
      notification,
    });
  }

  await pushNotification(notifications[0].type, notifications[0].ref, user_ids);
};

const pushNotification = async (notification_type, ref, user_ids) => {
  const params = { title: "", body: "", user_ids };

  switch (notification_type) {
    case notification_types.NEW_JOB_REQUEST:
      params.title = "New job";
      params.body = `${ref.job_request?.title ?? ''}`;
      break;
    case notification_types.JOB_REQUEST_ACCEPTED:
      params.title = "Job accepted";
      params.body = `"${ref.job_request?.title ?? ''}" has been accepted by ${ref.job_request?.expert?.user?.first_name ?? 'expert'}`;
      break;
    case notification_types.JOB_REQUEST_CANCELED:
      params.title = "Job canceled";
      params.body = `"${ref.job_request?.title ?? ''}" has been canceled`;
      break;
    case notification_types.PAYMENT:
      params.title = "Payment";
      params.body = `+${ref.transaction?.amount?.toString().replace(/\d(?=(\d{3})+$)/g, '$&,') ?? 0}₫ for "${ref.transaction?.job_request?.title ?? ''}"`;
      break;
  }

  await sendPushNotifications(params);
}

export default {
  updateBalance,
  notify,
  notifyMultipleUsers,
};
