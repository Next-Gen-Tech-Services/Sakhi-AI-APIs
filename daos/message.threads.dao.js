const MessageThread = require("../models/message.threads.model");
const log = require("../configs/logger.config");
const { v4: uuidv4 } = require("uuid");

class MessageThreadDao {
    // Create a new thread with initial messageCount = 0.
    async createThread(data) {
        try {
            const threadId = uuidv4();
            data.threadId = threadId;
            // Instead of a message array, we now maintain a counter.
            data.messageCount = 0;

            const thread = new MessageThread(data);
            const result = await thread.save();

            if (!result) {
                log.error("DAO: Failed to create message thread");
                throw new Error("Thread creation failed");
            }

            return {
                message: "Thread created successfully",
                status: "success",
                data: result,
                code: 200,
            };
        } catch (error) {
            log.error("DAO Error [createThread]: ", error);
            throw error;
        }
    }

    // Get thread by threadId
    async getThreadByThreadId(threadId) {
        try {
            const thread = await MessageThread.findOne({ threadId });
            if (!thread) {
                return {
                    message: "Thread not found",
                    status: "failed",
                    data: null,
                    code: 201,
                };
            }
            return {
                message: "Thread found",
                status: "success",
                data: thread,
                code: 200,
            };
        } catch (error) {
            log.error("DAO Error [getThreadByThreadId]: ", error);
            throw error;
        }
    }

    async getThreadsByUserId(userId) {
        try {
            // Force Cosmos to not sort by avoiding Mongoose query sort entirely
            const threads = await MessageThread.find({ userId })
                .lean() // plain JS objects
                .readConcern('local') // keep it simple, avoid optimizations
                .hint({ _id: 1 }); // force using the _id index only

            // Sort manually in JS
            const sortedThreads = threads.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            return {
                message: "Threads fetched successfully",
                status: "success",
                data: sortedThreads,
                code: 200,
            };
        } catch (error) {
            log.error("DAO Error [getThreadsByUserId]: ", error);
            throw error;
        }
    }




    /*
    As Suneel Sir directed, I'm apply In-memory sort operation in server because
    as of now cosmos db owner(sampat Sir) nto avaialble to update index policy
    if we update index policy and added createAt field in it below function will run smothly
    */
    /*
    // Get all threads for a userId
    async getThreadsByUserId(userId) {
        try {
            const threads = await MessageThread.find({ userId }).sort({ createdAt: -1 });
            return {
                message: "Threads fetched successfully",
                status: "success",
                data: threads,
                code: 200,
            };
        } catch (error) {
            log.error("DAO Error [getThreadsByUserId]: ", error);
            throw error;
        }
    }
    */
    async incrementMessageCount(threadId, incrementBy = 1) {
        try {
            const updated = await MessageThread.findOneAndUpdate(
                { threadId },
                { $inc: { messageCount: incrementBy } },
                { new: true }
            );

            if (!updated) {
                return {
                    message: "Thread not found",
                    status: "failed",
                    data: null,
                    code: 201,
                };
            }

            return {
                message: "Message count updated in thread",
                status: "success",
                data: updated,
                code: 200,
            };
        } catch (error) {
            log.error("DAO Error [incrementMessageCount]: ", error);
            throw error;
        }
    }

    // For multiple messages, this method increments the count by
    // the number of messages provided (e.g. if adding 2 messages, increment by 2).
    async addMessagesToThread(threadId, messagesArray = []) {
        try {
            const incrementBy = messagesArray.length;
            const updatedThread = await MessageThread.findOneAndUpdate(
                { threadId },
                { $inc: { messageCount: incrementBy } },
                { new: true }
            );
            if (!updatedThread) {
                return {
                    message: "Thread not found",
                    status: "failed",
                    data: null,
                    code: 201,
                };
            }
            return {
                message: "Messages count updated in thread",
                status: "success",
                data: updatedThread,
                code: 200,
            };
        } catch (error) {
            log.error("DAO Error [addMessagesToThread]:", error);
            return {
                message: "Failed to update message count in thread",
                status: "failed",
                data: null,
                code: 500,
            };
        }
    }

    // Delete thread by threadId
    async deleteThreadByThreadId(threadId) {
        try {
            const deleted = await MessageThread.findOneAndDelete({ threadId });
            if (!deleted) {
                return {
                    message: "Thread not found",
                    status: "failed",
                    data: null,
                    code: 201,
                };
            }
            return {
                message: "Thread deleted successfully",
                status: "success",
                data: deleted,
                code: 200,
            };
        } catch (error) {
            log.error("DAO Error [deleteThreadByThreadId]: ", error);
            throw error;
        }
    }

    // Delete thread and its messages.
    // (Assumes messageDao.deleteByThreadId is responsible for deleting the actual messages.)
    async deleteThreadAndMessages(threadId) {
        try {
            const deletedMessages = await messageDao.deleteByThreadId(threadId);
            if (deletedMessages.status !== "success") {
                throw new Error("Failed to delete messages for thread");
            }

            const deletedThread = await this.deleteThreadByThreadId(threadId);
            if (deletedThread.status !== "success") {
                throw new Error("Failed to delete message thread");
            }

            return {
                message: "Thread and all messages deleted successfully",
                status: "success",
                code: 200,
                data: {
                    thread: deletedThread.data,
                    deletedMessagesCount: deletedMessages.data.deletedCount,
                },
            };
        } catch (error) {
            log.error("DAO Error [deleteThreadAndMessages]: ", error);
            throw error;
        }
    }

    // Check if thread exists
    async isThreadExists(threadId) {
        try {
            const thread = await MessageThread.findOne({ threadId });
            return !!thread;
        } catch (error) {
            log.error("DAO Error [isThreadExists]: ", error);
            throw error;
        }
    }
}
module.exports = new MessageThreadDao();
