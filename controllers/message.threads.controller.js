const messageThreadsService = require("../services/message.threads.service");

class MessageThreadsController {
    async getAllThreads(req, res) {
        try {
            const result = await messageThreadsService.getAllThreadsService(req, res);
            return result;
        } catch (error) {
            throw error;
        }
    }
    async getAllMessageFromThreads(req, res) {
        try {
            const result = await messageThreadsService.getAllMessagesFromThreadsService(req, res);
            return result;
        } catch (error) {
            throw error;
        }
    }
    async renameThreadByThreadId(req, res) {
        try {
            const result = await messageThreadsService.renameThreadByThreadIdService(req, res);
            return result;
        } catch (error) {
            throw error;
        }
    }
    async deleteThreadByThreadId(req, res) {
        try {
            const result = await messageThreadsService.deleteThreadByThreadIdService(req, res);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MessageThreadsController();
