import PushToken from "../models/PushToken.js";

const saveToken = async ({ token, user_id }) => {
  await PushToken.findOneAndUpdate(
    { token },
    { user: user_id },
    {
      upsert: true,
    }
  );
};

const getTokensByUserIds = async ({ user_ids }) => {
  const pushTokens = await PushToken.find({ user: { $in: user_ids } });
  return pushTokens;
};

export default {
  saveToken,
  getTokensByUserIds,
};
