import {
  createThread,
  askChatbot,
  runAssistant,
  deleteThread,
} from "../utils/chatbot.js";

const createUserThread = async () => {
  const thread = await createThread();
  return thread;
};

const deleteUserThread = async (threadId) => {
  const thread = await deleteThread(threadId);
  return thread;
};

export default { createUserThread, deleteUserThread };
