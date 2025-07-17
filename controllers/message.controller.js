const messageService = require("../services/message.service");

class messageController {
    async getMessage(req, res) {
        try {
            const result = await messageService.getMessageService(req, res);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new messageController();
