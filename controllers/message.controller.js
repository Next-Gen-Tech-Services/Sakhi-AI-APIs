const messageService = require("../services/message.service");

class messageController {
    async sendMessage(req, res) {
        try {
            const result = await messageService.sendMessageService(req, res);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new messageController();
