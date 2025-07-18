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
    async getProfileService(req, res) {
        try {
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({
                    message: "Unauthorized: User ID not found in token",
                    status: "failed",
                    data: null,
                    code: 401,
                });
            }

            // Step 3: Get user from database
            const result = await userDao.getUserById(userId);

            // Step 4: Send back DAO's response
            return res.status(result.code).json(result);

        } catch (error) {
            log.error("Error from [USER SERVICE - getProfile]: ", error);
            return res.status(500).json({
                message: "Internal Server Error",
                status: "failed",
                data: null,
                code: 500,
            });
        }
    }
    async updateProfileService(req, res) {
        try {
            const userId = req.userId;
            const { name, email, gender, dob } = req.body;

            if (!userId) {
                return res.status(401).json({
                    message: "Unauthorized",
                    status: "fail",
                    code: 401,
                    data: null,
                });
            }

            const updateData = {};

            if (name !== undefined) updateData.name = name.trim();

            if (email !== undefined) {
                const normalizedEmail = email.trim().toLowerCase();

                if (normalizedEmail !== "") {
                    // Check if email is already taken by another user
                    const existingUserResult = await userDao.getUserByEmail(normalizedEmail);

                    if (existingUserResult?.data && existingUserResult.data._id.toString() !== userId) {
                        return res.status(409).json({
                            message: "Email already in use",
                            status: "fail",
                            code: 409,
                            data: null,
                        });
                    }
                } else {
                    // If email is empty string, allow only if no other user exists with email ""
                    const existingUserResult = await userDao.getUserByEmail("");
                    if (existingUserResult?.data && existingUserResult.data._id.toString() !== userId) {
                        return res.status(409).json({
                            message: "Email already in use",
                            status: "fail",
                            code: 409,
                            data: null,
                        });
                    }
                }

                updateData.email = normalizedEmail;
            }

            if (gender !== undefined) updateData.gender = gender;
            if (dob !== undefined) updateData.dob = new Date(dob);

            const updatedUser = await userDao.updateUserById(userId, updateData);

            if (!updatedUser) {
                return res.status(404).json({
                    message: "User not found",
                    status: "fail",
                    code: 404,
                    data: null,
                });
            }

            return res.status(200).json({
                message: "Profile updated successfully",
                status: "success",
                code: 200
            });

        } catch (error) {
            log.error("Error updating profile:", error);
            return res.status(500).json({
                message: "Internal server error",
                status: "error",
                code: 500,
                data: null,
            });
        }
    }
}

module.exports = new UserService();
