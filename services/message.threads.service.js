const messageThreadsDao = require("../daos/message.threads.dao");
const { compareItems, hashItem } = require("../utils/helpers/bcrypt.util");
const OTPDao = require("../daos/opt.dao");
const log = require("../configs/logger.config");
const { createToken, verifyToken } = require("../utils/helpers/tokenHelper.util");
const { validateEmail } = require("../utils/helpers/validator.util");
const { removeNullUndefined, randomString } = require("../utils/helpers/common.util");
const { sendMail } = require("../utils/helpers/email.util");
const messageHistoryDao = require("../daos/message.history.dao");

// Self: Aakash MSG DAO is pending because sunil Sir just want functional api

class MessageThreadsService {
    async getAllThreadsService(req, res) {
        try {
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({
                    message: "Unauthorized: User ID missing from token",
                    status: "failed",
                    data: null,
                    code: 401,
                });
            }

            const result = await messageThreadsDao.getThreadsByUserId(userId);

            // Filter only title and threadId at service layer
            const filteredThreads = (result.data || []).map((thread) => ({
                threadId: thread.threadId,
                title: thread.title,
            }));

            return res.status(200).json({
                message: "Threads fetched successfully",
                status: "success",
                data: filteredThreads,
                code: 200,
            });

        } catch (error) {
            log.error("Service Error [getAllMessageThreadsService]: ", error);
            return res.status(500).json({
                message: "Internal Server Error",
                status: "failed",
                data: null,
                code: 500,
            });
        }
    }


    async getAllMessagesFromThreadsService(req, res) {
        try {
            const threadId = req.params.threadId;

            if (!threadId) {
                return res.status(400).json({
                    message: "Thread ID is required",
                    status: "failed",
                    data: null,
                    code: 400,
                });
            }

            const exists = await messageThreadsDao.isThreadExists(threadId);
            if (!exists) {
                return res.status(404).json({
                    message: "Thread not found",
                    status: "failed",
                    data: null,
                    code: 404,
                });
            }

            const result = await messageHistoryDao.getMessagesByThreadId(threadId);

            if (result?.status !== "success") {
                return res.status(result.code).json(result);
            }

            const formattedMessages = result.data
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) // sort by time
                .map(msg => ({
                    chatId: msg.chatId,
                    threadId: msg.threadId,
                    sender: msg.sender,
                    message: msg.message,
                    timestamp: msg.timestamp,
                }));

            return res.status(200).json({
                message: "Messages fetched successfully",
                status: "success",
                data: formattedMessages,
                code: 200,
            });

        } catch (error) {
            log.error("Service Error [getAllMessagesFromThreadsService]: ", error);
            return res.status(500).json({
                message: "Internal Server Error",
                status: "failed",
                data: null,
                code: 500,
            });
        }
    }
}

module.exports = new MessageThreadsService();
