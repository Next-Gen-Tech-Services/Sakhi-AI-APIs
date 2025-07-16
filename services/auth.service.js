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

class AuthService {
  async requestOTPService(req, res) {
    try {
      const { mobile } = req.body;

      if (!mobile) {
        return res.status(400).json({
          message: "Mobile number is required",
          status: "failed",
          data: null,
          code: 400,
        });
      }

      // Check if user exists
      let userResult = await userDao.getUserByMobile(mobile);

      if (!userResult.data) {
        // Create new user if not found
        const userData = {
          mobile,
          via: "mobile",
          isVerified: false, // I think we don't need this prop
        };
        userResult = await userDao.createUser(userData);
      }

      const otp = "1234"; // Static mock OTP for now

      // Delete previous OTPs
      await OTPDao.deleteOTPByMobile(mobile);

      // Save new OTP
      await OTPDao.createOTP({ mobile, otp });

      return res.status(200).json({
        message: "OTP sent successfully",
        status: "success",
        data: {
          userId: userResult.data._id,
          mobile: userResult.data.mobile,
        },
        code: 200,
      });
    } catch (error) {
      log.error("Error in requestOTPService:", error);
      return res.status(500).json({
        message: "Internal server error",
        status: "failed",
        code: 500,
      });
    }
  }

  async verifyOTPService(req, res) {
    try {
      const { mobile, otp } = req.body;

      if (!mobile || !otp) {
        return res.status(400).json({
          message: "Mobile number and OTP are required",
          status: "failed",
          data: null,
          code: 400,
        });
      }

      // Validate OTP
      const otpResult = await OTPDao.getOTPByMobileAndCode(mobile, otp);
      if (!otpResult.data) {
        return res.status(401).json({
          message: "Invalid or expired OTP",
          status: "failed",
          code: 401,
          data: null,
        });
      }

      // Fetch user
      const userResult = await userDao.getUserByMobile(mobile);
      if (!userResult.data) {
        return res.status(404).json({
          message: "User not found",
          status: "failed",
          data: null,
          code: 404,
        });
      }

      const user = userResult.data;

      // Mark as verified
      user.isVerified = true;
      await user.save();

      // Generate JWT
      const token = createToken(user._id);

      // Clean up OTP
      await OTPDao.deleteOTPByMobile(mobile);

      return res.status(200).json({
        message: "OTP verified successfully",
        status: "success",
        token,
        user: {
          _id: user._id,
          mobile: user.mobile,
          name: user.name,
          isVerified: user.isVerified,
        },
        code: 200,
      });
    } catch (error) {
      log.error("Error in verifyOTPService:", error);
      return res.status(500).json({
        message: "Internal server error",
        status: "failed",
        code: 500,
      });
    }
  }

  async registerService(req, res) {
    try {
      const { email, password, type } = req.body;
      if (!email && !password && !type) {
        log.error("Error from [User SERVICE]: Invalid Request");
        return res.status(400).json({
          message: "Invalid Request",
          status: "failed",
          data: null,
          code: 201,
        });
      }
      if (type == "direct") {
        if (!validateEmail(email)) {
          log.error("Error from [User SERVICE]: Invalid Email Address");
          return res.status(400).json({
            message: "Invalid Email Address",
            status: "failed",
            data: null,
            code: 201,
          });
        }
        const userExist = await userDao.getUserByEmail(email);
        if (userExist.data == null) {
          const data = {
            email,
            password: await hashItem(password),
            via: type,
            emailToken: await randomString(24),
          };
          const dataToUpdate = removeNullUndefined(data);
          const userInfo = await userDao.createUser(dataToUpdate);

          if (userInfo.data !== null) {
            const token = createToken(userInfo.data.userId);
            sendMail({
              email: email,
              subject: "Activate your account",
              template: "activationMail.ejs",
              data: { activationLink: data.emailToken, email },
            });
            return res.status(200).json({
              status: "success",
              code: 200,
              message: "Please check your email to activate your account",
              data: {
                user: {
                  userId: userInfo.data.userId,
                  email: userInfo.data.email,
                  isVerified: userInfo.data.isVerified,
                  isProfile: userInfo.data.isProfile,
                },
                token,
              },
            });
          } else {
            return res.status(201).json({
              status: "fail",
              code: 201,
              message: "Something went wrong",
              data: null,
            });
          }
        } else {
          return res.status(201).json({
            status: "alreadyExists",
            code: 201,
            message: "Email already exists",
            data: null,
          });
        }
      } else {
        return res.status(201).json({
          status: "fail",
          code: 201,
          message: "Invalid request",
          data: null,
        });
      }

      // }
    } catch (error) {
      log.error("Error from [Auth SERVICE]:", error);
      throw error;
    }
  }

  async loginService(req, res) {
    try {
      const { email, password, type } = req.body;
      if (!email && !password && !type) {
        log.error("Error from [User SERVICE]: Invalid Request");
        return res.status(400).json({
          message: "Invalid Request",
          status: "failed",
          data: null,
          code: 201,
        });
      }
      if (!validateEmail(email)) {
        log.error("Error from [User SERVICE]: Invalid Email Address");
        return res.status(400).json({
          message: "Invalid Email Address",
          status: "failed",
          data: null,
          code: 201,
        });
      }
      const user = await userDao.getUserByEmail(email);
      if (user.data == null) {
        return res.status(400).json({
          message: "Account does not exist",
          status: "notFound",
          code: 201,
          data: null,
        });
      } else {
        if (type == "direct" && user.data.via == "direct") {
          const validateUser = await compareItems(password, user.data.password);
          if (!validateUser) {
            log.error("Error from [Auth SERVICE]: Please enter password");
            return res.status(400).json({
              message: "Please enter correct password",
              status: "failed",
              code: 201,
              data: null,
            });
          }
          log.info("[Auth SERVICE]: User verified successfully");
          const token = createToken(user.data.userId);
          return res.status(200).json({
            message: "User verified successfully",
            status: "success",
            code: 200,
            data: {
              user: {
                userId: user.data.userId,
                email: user.data.email,
                isVerified: user.data.isVerified,
                isProfile: user.data.isProfile,
              },
              token,
            },
          });
        } else {
          return res.status(400).json({
            message: "Please login with google",
            status: "notFound",
            code: 201,
            data: null,
          });
        }
      }
    } catch (error) {
      log.error("Error from [Auth SERVICE]:", error);
      throw error;
    }
  }

  async googleLoginService(req, res) {
    try {
      const { email, type, name, accountId } = req.body;
      if (!email && !type && !name && !accountId) {
        log.error("Error from [User SERVICE]: Invalid Request");
        return res.status(400).json({
          message: "Invalid Reques12t",
          status: "failed",
          data: null,
          code: 201,
        });
      }
      if (!validateEmail(email)) {
        log.error("Error from [User SERVICE]: Invalid Email Address");
        return res.status(400).json({
          message: "Invalid Email Address",
          status: "failed",
          data: null,
          code: 201,
        });
      }
      const user = await userDao.getUserByEmail(email);
      if (user.data == null) {
        if (type === "google") {
          const data = {
            email,
            via: type,
            accountId,
            name,
            isVerified: true,
          };
          const dataToUpdate = removeNullUndefined(data);
          const userInfo = await userDao.createUser(dataToUpdate);
          const token = createToken(userInfo.data.userId);
          return res.status(200).json({
            status: "success",
            code: 200,
            message: "Please check your email to activate your account",
            data: {
              user: {
                userId: userInfo.data.userId,
                email: userInfo.data.email,
                isVerified: userInfo.data.isVerified,
                isProfile: userInfo.data.isProfile,
              },
              token,
            },
          });
        } else {
          return res.status(400).json({
            message: "Please login with email and password",
            status: "fail",
            code: 201,
            data: null,
          });
        }
      } else {
        if (type == "google" && user.data.via == "google") {
          log.info("[Auth SERVICE]: User verified successfully");
          const token = createToken(user.data.userId);
          return res.status(200).json({
            message: "User verified successfully",
            status: "success",
            code: 200,
            data: {
              user: {
                userId: user.data.userId,
                email: user.data.email,
                isVerified: user.data.isVerified,
                isProfile: user.data.isProfile,
              },
              token: token,
            },
          });
        } else {
          return res.status(400).json({
            message: "Please login with email and password",
            status: "fail",
            code: 201,
            data: null,
          });
        }
      }
    } catch (error) {
      log.error("Error from [Auth SERVICE]:", error);
      throw error;
    }
  }

  async forgetPasswordService(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        log.error("Error from [User SERVICE]: Invalid Request");
        return res.status(400).json({
          message: "Invalid Request",
          status: "failed",
          data: null,
          code: 201,
        });
      }
      if (!validateEmail(email)) {
        log.error("Error from [User SERVICE]: Invalid Email Address");
        return res.status(400).json({
          message: "Invalid Email Address",
          status: "failed",
          data: null,
          code: 201,
        });
      }
      const user = await userDao.getUserByEmail(email);
      if (user.data != null) {
        if (user.data.via === "direct") {
          const data = {
            resetToken: await randomString(25),
            email,
          };
          const dataToUpdate = removeNullUndefined(data);
          const userInfo = await userDao.updateUser(dataToUpdate);
          sendMail({
            email: email,
            subject: "Reset your account",
            template: "resetToken.ejs",
            data,
          });
          return res.status(200).json({
            status: "success",
            code: 200,
            message: "Please check your email to reset your password",
          });
        } else {
          return res.status(400).json({
            message: "Please login with google account",
            status: "fail",
            code: 201,
            data: null,
          });
        }
      } else {
        return res.status(400).json({
          message: "Account does not exist",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("Error from [Auth SERVICE]:", error);
      throw error;
    }
  }

  async resetPasswordService(req, res) {
    try {
      const { token, password } = req.body;
      if (!token && !password) {
        log.error("Error from [User SERVICE]: Invalid Request");
        return res.status(400).json({
          message: "Invalid Request",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      const user = await userDao.getUserByResetToken(token);
      if (user.data != null) {
        if (user.data.via === "direct") {
          const data = {
            email: user.data.email,
            password,
            resetToken: null,
          };
          const userInfo = await userDao.updateUser(data);
          return res.status(200).json({
            status: "success",
            code: 200,
            message: "Password changed successfully",
          });
        } else {
          return res.status(400).json({
            message: "Please login with google account",
            status: "fail",
            code: 201,
            data: null,
          });
        }
      } else {
        return res.status(400).json({
          message: "Account does not exist",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("Error from [Auth SERVICE]:", error);
      throw error;
    }
  }
}

module.exports = new AuthService();
