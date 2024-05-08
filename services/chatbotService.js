import { createThread, askChatbot, runAssistant } from "../utils/chatbot.js";

const createUserThread = async () => {
  const thread = await createThread();
  return thread;
};

export default { createUserThread };
