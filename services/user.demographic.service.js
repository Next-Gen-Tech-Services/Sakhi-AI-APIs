const userDemographicDao = require("../daos/user.demographic.dao");
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
const { ENGLISH,
    HINDI,
    BENGALI,
    TAMIL,
    TELUGU,
    MARATHI,
    GUJARATI,
    KANNADA,
    MALAYALAM,
    ORIYA,
    PUNJABI,
    ASSAMESE,
    MAITHILI,
    URDU,
    KASHMIRI,
    KONKANI,
    MANIPURI,
    SANSKRIT,
    SANTHALI,
    DOGRI,
    NEPALI,
    BODO,
    SINDHI } = require("../utils/constants/language.constant");

const { MALE, FEMALE, OTHER } = require("../utils/constants/gender.constant");

const allowedGenders = [MALE, FEMALE, OTHER];

class UserDemographicService {
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

            // Fetch full user document
            const result = await userDemographicDao.getUserById(userId);

            if (result.status !== "success" || !result.data) {
                return res.status(result.code).json(result);
            }

            // Destructure needed fields
            const { name, email, gender, age, preferredLanguage, tier, mobile } = result.data;

            // Send only filtered fields
            return res.status(200).json({
                message: "User found",
                status: "success",
                code: 200,
                data: {
                    user: {
                        name,
                        email,
                        gender,
                        age,
                        preferredLanguage,
                        tier,
                        mobile
                    }
                }
            });

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
    /*
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
    */
    async updateProfileService(req, res) {
        try {
            const userId = req.userId;
            const { name, email, gender, age, preferredLanguage } = req.body;

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

                if (!validateEmail(normalizedEmail)) {
                    return res.status(400).json({
                        message: "Invalid email format",
                        status: "fail",
                        code: 400,
                        data: null,
                    });
                }

                const existingUserResult = await userDemographicDao.getUserByEmail(normalizedEmail);

                if (
                    existingUserResult?.data &&
                    existingUserResult.data.userId !== userId
                ) {
                    return res.status(409).json({
                        message: "Email already in use",
                        status: "fail",
                        code: 409,
                        data: null,
                    });
                }

                updateData.email = normalizedEmail;
            }

            if (gender !== undefined) {
                const allowedGenders = [MALE, FEMALE, OTHER];
                if (!allowedGenders.includes(gender)) {
                    return res.status(400).json({
                        status: false,
                        message: "Invalid gender. Allowed: male, female, other.",
                        code: 400,
                        data: null,
                    });
                }
                updateData.gender = gender;
            }

            if (age !== undefined) {
                if (typeof age !== "number" || age < 0 || age > 120) {
                    return res.status(400).json({
                        status: false,
                        message: "Invalid age. Must be between 0 and 120.",
                        code: 400,
                        data: null,
                    });
                }
                updateData.age = age;
            }

            if (preferredLanguage !== undefined) {
                const allowedLanguages = [
                    ENGLISH, HINDI, BENGALI, TAMIL, TELUGU, MARATHI,
                    GUJARATI, KANNADA, MALAYALAM, ORIYA, PUNJABI, ASSAMESE,
                    MAITHILI, URDU, KASHMIRI, KONKANI, MANIPURI, SANSKRIT,
                    SANTHALI, DOGRI, NEPALI, BODO, SINDHI,
                ];
                if (!allowedLanguages.includes(preferredLanguage)) {
                    return res.status(400).json({
                        status: false,
                        message: "Invalid preferred language.",
                        code: 400,
                        data: null,
                    });
                }
                updateData.preferredLanguage = preferredLanguage;
            }

            const updatedUserResult = await userDemographicDao.updateUserByUserId(userId, updateData);

            if (!updatedUserResult?.data) {
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
                code: 200,
                data: {
                    name: updatedUserResult?.data?.name,
                    email: updatedUserResult?.data?.email,
                    gender: updatedUserResult?.data?.gender,
                    age: updatedUserResult?.data?.age,
                    preferredLanguage: updatedUserResult?.data?.preferredLanguage,
                }
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

module.exports = new UserDemographicService();
