const userDao = require("../daos/user.dao");
const { compareItems, hashItem } = require("../utils/helpers/bcrypt.util");
const OTPDao = require("../daos/opt.dao");
const log = require("../configs/logger.config");
const { createToken } = require("../utils/helpers/tokenHelper.util");
const { validateEmail } = require("../utils/helpers/validator.util");
const {
    removeNullUndefined,
    randomString,
} = require("../utils/helpers/common.util");
const { sendMail } = require("../utils/helpers/email.util");

const Conversation = require("../models/conversation.model");

class UserService {
    async getAllConversationService(req, res) {
        try {
            const conversations = await Conversation.find().sort({ timestamp: 1 });

            return res.status(200).json({
                message: "Fetched all conversations",
                status: "success",
                code: 200,
                data: conversations,
            });
        } catch (error) {
            log.error("Error from [UserService -> getAllConversationService]:", error);
            return res.status(500).json({
                message: "Internal Server Error",
                status: "failed",
                code: 500,
                data: null,
            });
        }
    }
}

module.exports = new UserService();
