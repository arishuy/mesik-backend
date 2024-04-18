import pushTokenService from "../services/pushTokenService.js";
import { Expo } from "expo-server-sdk";

const expo = new Expo();

export async function sendPushNotifications({ title, body, user_ids }) {
  try {
    const tokens = await pushTokenService.getTokensByUserIds({ user_ids });
    if(tokens.length === 0) return;
    const messages = tokens.map((item) => ({
      to: item.token,
      sound: "default",
      title,
      body,
    }));
    expo.sendPushNotificationsAsync(messages);
  } catch (error) {
    console.log(error);
  }
}
