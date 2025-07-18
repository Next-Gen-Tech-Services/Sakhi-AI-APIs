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

    async getProfile(req, res) {
        try {
            const result = await userService.getProfileService(req, res);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async updateProfile(req, res) {
        try {
            const result = await userService.updateProfileService(req, res);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserController();
