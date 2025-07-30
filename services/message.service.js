const userDao = require("../daos/user.demographic.dao");
const { compareItems, hashItem } = require("../utils/helpers/bcrypt.util");
const OTPDao = require("../daos/opt.dao");
const log = require("../configs/logger.config");
const { createToken, verifyToken } = require("../utils/helpers/tokenHelper.util");
const { validateEmail } = require("../utils/helpers/validator.util");
const { removeNullUndefined, randomString } = require("../utils/helpers/common.util");
const { sendMail } = require("../utils/helpers/email.util");
const axios = require("axios");
const messageHistoryDao = require("../daos/message.history.dao");
const messageThreadsDao = require("../daos/message.threads.dao");
const { v4: uuidv4 } = require("uuid");

const CHAT_BOT_URL = "https://chat-deployment.blackdesert-6a7b405b.centralindia.azurecontainerapps.io/message";

class MessageService {
    async sendMessageService(req, res) {
        try {
            const userId = req.userId;
            const { threadId: incomingThreadId, message, timestamp } = req.body;

            if (!userId || !message?.trim()) {
                return res.status(400).json({
                    message: "Message and userId are required",
                    status: "failed",
                    data: null,
                    code: 400,
                });
            }

            const trimmedMessage = message.trim();

            // ---------------------------------------------
            // Step 1: Handle thread
            let threadId = incomingThreadId?.trim();
            let createdThread = null;

            if (!threadId) {
                const threadResp = await messageThreadsDao.createThread({
                    userId,
                    title: trimmedMessage.substring(0, 25),
                    messageCount: 0,
                });

                if (threadResp?.status !== "success") {
                    return res.status(500).json({
                        message: "Failed to create thread",
                        status: "failed",
                        data: null,
                        code: 500,
                    });
                }

                threadId = threadResp.data.threadId;
                createdThread = threadResp.data;
            } else {
                const existingThread = await messageThreadsDao.getThreadByThreadId(threadId);
                if (!existingThread?.data) {
                    return res.status(404).json({
                        message: "Thread not found",
                        status: "failed",
                        data: null,
                        code: 404,
                    });
                }
            }

            // ---------------------------------------------
            // Step 2: Save user message
            const userMsgResp = await messageHistoryDao.createMessage({
                userId,
                threadId,
                sender: "user",
                message: trimmedMessage,
                timestamp: new Date(timestamp),
            });

            if (userMsgResp?.status !== "success") {
                if (createdThread) await messageThreadsDao.deleteThreadByThreadId(threadId);
                return res.status(500).json({
                    message: "Failed to save user message",
                    status: "failed",
                    data: null,
                    code: 500,
                });
            }

            const userMessage = userMsgResp.data;

            // ---------------------------------------------
            // Step 3: Call chatbot API
            const params = new URLSearchParams();
            params.append("user_id", userId);
            params.append("message", trimmedMessage);
            params.append("thread_id", threadId);
            params.append("message_id", userMessage._id.toString());

            let botResponse;
            try {
                const chatApiResp = await axios.post(CHAT_BOT_URL, params, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });

                botResponse = chatApiResp.data?.output_message || "Sorry, no response from assistant.";
            } catch (err) {
                log.error("Error calling chatbot API:", err);
                botResponse = "Sorry, something went wrong with assistant.";
            }

            // ---------------------------------------------
            // Step 4: Save assistant message
            const assistantMsgResp = await messageHistoryDao.createMessage({
                userId,
                threadId,
                sender: "assistant",
                message: botResponse,
                timestamp: new Date(),
            });

            if (assistantMsgResp?.status !== "success") {
                await messageHistoryDao.deleteMessageById(userMessage._id);
                if (createdThread) await messageThreadsDao.deleteThreadByThreadId(threadId);
                return res.status(500).json({
                    message: "Failed to save assistant message",
                    status: "failed",
                    data: null,
                    code: 500,
                });
            }

            // ---------------------------------------------
            // Step 5: Increment thread message count
            const countResp = await messageThreadsDao.incrementMessageCount(threadId, 2);
            if (countResp?.status !== "success") {
                await messageHistoryDao.deleteMessageById(userMessage._id);
                await messageHistoryDao.deleteMessageById(assistantMsgResp.data._id);
                if (createdThread) await messageThreadsDao.deleteThreadByThreadId(threadId);

                return res.status(500).json({
                    message: "Failed to update thread count",
                    status: "failed",
                    data: null,
                    code: 500,
                });
            }

            // ---------------------------------------------
            return res.status(200).json({
                message: "Message sent successfully",
                status: "success",
                code: 200,
                data: {
                    threadId,
                    responseMessage: assistantMsgResp.data.message,
                    messageId: assistantMsgResp.data.chatId,
                },
            });
        } catch (error) {
            log.error("Service Error [sendMessageService]:", error);
            return res.status(500).json({
                message: "Internal Server Error",
                status: "failed",
                data: null,
                code: 500,
            });
        }
    }
}

module.exports = new MessageService();
