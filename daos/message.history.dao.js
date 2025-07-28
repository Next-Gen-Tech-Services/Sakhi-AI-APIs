const ChatHistory = require("../models/chat-history.model");
const log = require("../configs/logger.config");
const { v4: uuidv4 } = require("uuid");

class MessageHistoryDao {
    // Save one message
    async createMessage({ userId, threadId, sender, message, timestamp }) {
        try {
            const chatId = uuidv4();

            const chatMessage = new ChatHistory({
                chatId,
                userId,
                threadId,
                sender,
                message,
                timestamp,
            });

            const saved = await chatMessage.save();

            return {
                message: "Message saved successfully",
                status: "success",
                data: saved,
                code: 200,
            };
        } catch (error) {
            log.error("DAO Error [createMessage]: ", error);
            throw error;
        }
    }

    // Get messages by threadId
    async getMessagesByThreadId(threadId) {
        try {
            const messages = await ChatHistory.find({ threadId }).sort({ timestamp: 1 });

            return {
                message: "Messages fetched successfully",
                status: "success",
                data: messages,
                code: 200,
            };
        } catch (error) {
            log.error("DAO Error [getMessagesByThreadId]: ", error);
            throw error;
        }
    }

    // Get all messages by userId (across all threads)
    async getMessagesByUserId(userId) {
        try {
            const messages = await ChatHistory.find({ userId }).sort({ timestamp: 1 });

            return {
                message: "Messages fetched successfully",
                status: "success",
                data: messages,
                code: 200,
            };
        } catch (error) {
            log.error("DAO Error [getMessagesByUserId]: ", error);
            throw error;
        }
    }

    // Delete one message by ID
    async deleteMessageById(chatId) {
        try {
            const deleted = await ChatHistory.findByIdAndDelete(chatId);

            if (!deleted) {
                return {
                    message: "Message not found",
                    status: "failed",
                    data: null,
                    code: 201,
                };
            }

            return {
                message: "Message deleted successfully",
                status: "success",
                data: deleted,
                code: 200,
            };
        } catch (error) {
            log.error("DAO Error [deleteMessageById]: ", error);
            throw error;
        }
    }

    // Delete all messages under a thread
    async deleteByThreadId(threadId) {
        try {
            const result = await ChatHistory.deleteMany({ threadId });

            return {
                message: "Messages deleted successfully for this thread",
                status: "success",
                data: { deletedCount: result.deletedCount },
                code: 200,
            };
        } catch (error) {
            log.error("DAO Error [deleteByThreadId]: ", error);
            throw error;
        }
    }
}

module.exports = new MessageHistoryDao();
