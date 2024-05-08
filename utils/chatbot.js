import OpenApi from "openai";
import dotenv from "dotenv";

dotenv.config();

const chatbot = new OpenApi({
  apiKey: process.env.OPEN_AI_KEY,
});

let pollingInterval = 1000;

const createThread = async () => {
  const thread = await chatbot.beta.threads.create();
  return thread;
};

const askChatbot = async (threadId, message) => {
  const response = await chatbot.beta.threads.messages.create(threadId, {
    role: "user",
    content:
      "Tìm cho tôi title có trong data của bạn có lyric tương tự như: " +
      message,
  });
  return response;
};

const runAssistant = async (threadId) => {
  const response = await chatbot.beta.threads.runs.create(threadId, {
    assistant_id: process.env.ASSISTANT_ID,
  });
  return response;
};

const checkingStatus = async (res, threadId, runId) => {
  const runObject = await chatbot.beta.threads.runs.retrieve(threadId, runId);

  const status = runObject.status;
  console.log(runObject);
  console.log("Current status: " + status);

  if (status == "completed") {
    clearInterval(pollingInterval);

    const messagesList = await chatbot.beta.threads.messages.list(threadId);
    let messages = messagesList.body.data[0].content;
    // messagesList.body.data.forEach((message) => {
    //   messages.push(message.content);
    // });
    res.json({ messages });
  }
};

export { createThread, askChatbot, runAssistant, checkingStatus, chatbot };
