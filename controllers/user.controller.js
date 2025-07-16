const userService = require("../services/user.service.js");

class UserController {
    async getAllConversation(req, res) {
        try {
            const result = await userService.getAllConversationService(req, res);
            return result;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new UserController();
