const OTP = require("../models/otp.model");
const log = require("../configs/logger.config");

class OTPDao {
    async createOTP(data) {
        try {
            const result = await OTP.create(data);
            return {
                message: "OTP created",
                status: "success",
                data: result,
                code: 200,
            };
        } catch (error) {
            log.error("Error from [OTP DAO]: ", error);
            throw error;
        }
    }

    async getOTPByMobileAndCode(mobile, otp) {
        try {
            const otpDoc = await OTP.findOne({ mobile, otp });
            if (!otpDoc) {
                return {
                    message: "OTP not found or expired",
                    status: "failed",
                    data: null,
                    code: 201,
                };
            }
            return {
                message: "OTP found",
                status: "success",
                data: otpDoc,
                code: 200,
            };
        } catch (error) {
            log.error("Error from [OTP DAO]: ", error);
            throw error;
        }
    }

    async deleteOTPByMobile(mobile) {
        try {
            await OTP.deleteMany({ mobile });
            return {
                message: "OTP(s) deleted",
                status: "success",
                code: 200,
            };
        } catch (error) {
            log.error("Error from [OTP DAO]: ", error);
            throw error;
        }
    }
}

module.exports = new OTPDao();
