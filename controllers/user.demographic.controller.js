const userDemographicService = require("../services/user.demographic.service.js");

class UserDemographicController {
    async getProfile(req, res) {
        try {
            const result = await userDemographicService.getProfileService(req, res);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getAllConversation(req, res) {
        try {
            const result = await userDemographicService.getAllConversationService(req, res);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async updateProfile(req, res) {
        try {
            const result = await userDemographicService.updateProfileService(req, res);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserDemographicController();
