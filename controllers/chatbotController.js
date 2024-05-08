import chatbotService from "../services/chatbotService.js";
import { askChatbot, runAssistant, chatbot } from "../utils/chatbot.js";

const createThread = async (req, res, next) => {
  try {
    const thread = await chatbotService.createUserThread();
    res.json({ thread });
  } catch (error) {
    next(error);
  }
};

const addMessage = async (req, res, next) => {
  try {
    let pollingInterval;
    const { message, threadId } = req.body;
    askChatbot(threadId, message).then((message) => {
      // Run the assistant
      runAssistant(threadId).then((run) => {
        const runId = run.id;

        // Check the status
        pollingInterval = setInterval(async () => {
          const runObject = await chatbot.beta.threads.runs.retrieve(
            threadId,
            runId
          );

          const status = runObject.status;
          console.log("Current status: " + status);
          if (status == "completed") {
            clearInterval(pollingInterval);
            const messagesList = await chatbot.beta.threads.messages.list(
              threadId
            );
            let messages = messagesList.body.data[0].content;

            // messagesList.body.data.forEach((message) => {
            //   messages.push(message.content);
            // });

            const value = messages[0].text.value;
            // Tìm vị trí của dấu " ở sau tên bài hát
            const startQuoteIndex = value.indexOf('"');

            // Tìm vị trí của dấu " tiếp theo sau dấu "
            const endQuoteIndex = value.indexOf('"', startQuoteIndex + 1);

            // Lấy ra tên bài hát
            const songName = value.slice(startQuoteIndex + 1, endQuoteIndex);
            res.json({ songName });
          }
        }, 1000);
      });
    });
  } catch (error) {
    next(error);
  }
};

export default { createThread, addMessage };
