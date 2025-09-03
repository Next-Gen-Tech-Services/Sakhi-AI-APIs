const User = require("../models/user.demographic.model");
const getNextSequenceValue = require("../utils/helpers/counter.util");
const log = require("../configs/logger.config");
const { hashItem } = require("../utils/helpers/bcrypt.util");
const { v4: uuidv4 } = require("uuid");


class UserDemographicDao {
  async getUserByMongooseId(mongooseId) {
    // not yet needed
  }
  async updateUserByMongooseId(mongooseId, updateData) {
    try {
      const updated = await User.findByIdAndUpdate(
        mongooseId,
        { $set: updateData },
        { new: true }
      );
      return updated;
    } catch (err) {
      console.error("DAO: Failed to update user", err);
      return null;
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findOne({ userId });
      if (!user) {
        return {
          message: "User not found",
          status: "failed",
          data: null,
          code: 201,
        };
      } else {
        return {
          message: "User found",
          status: "success",
          data: user,
          code: 200,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO]: ", error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const userExist = await User.findOne({
        email: email,
      });
      if (userExist != null) {
        return {
          message: "Successfully",
          status: "success",
          data: userExist,
          code: 200,
        };
      } else {
        return {
          message: "User not found",
          status: "failed",
          data: null,
          code: 201,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO]: ", error);
      throw error;
    }
  }

  async getUserByResetToken(resetToken) {
    try {
      const userExist = await User.findOne({
        resetToken,
      });
      if (userExist != null) {
        return {
          message: "Successfully",
          status: "success",
          data: userExist,
          code: 200,
        };
      } else {
        return {
          message: "User not found",
          status: "failed",
          data: null,
          code: 201,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO]: ", error);
      throw error;
    }
  }

  async createUser(data) {
    try {
      const sequence = await getNextSequenceValue("user");
      const uuid = uuidv4();
      // Assign to both _id and userId
      data._id = uuid;
      data.userId = uuid;

      const user = new User(data);
      const result = await user.save();

      if (!result) {
        log.error("Error from [USER DAO]: User creation error");
        throw new Error("User creation failed");
      }

      log.info("✅ User saved");

      return {
        message: "User created successfully",
        data: result,
        status: "success",
        code: 200,
      };
    } catch (error) {
      log.error("❌ Error from [USER DAO]:", error);
      throw error;
    }
  }

  async updateUser(data) {
    try {
      if (data?.password) {
        data.password = await hashItem(data.password);
      }
      let result;
      result = await User.findOneAndUpdate({ email: data.email }, data, {
        new: true,
      });

      log.info("User saved");
      if (!result) {
        log.error("Error from [USER DAO]: User updation error");
        return {
          message: "Something went wrong",
          data: null,
          status: "fail",
          code: 201,
        };
      } else {
        return {
          message: "User updated successfully",
          data: result,
          status: "success",
          code: 200,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO]: ", error);
      throw error;
    }
  }

  async getUserByMobile(mobile) {
    try {
      const user = await User.findOne({ mobile });
      if (user) {
        return {
          message: "User found",
          status: "success",
          data: user,
          code: 200,
        };
      } else {
        return {
          message: "User not found",
          status: "failed",
          data: null,
          code: 201,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO]: ", error);
      throw error;
    }
  }
  async updateUserByUserId(userId, updateData) {
    try {
      const updated = await User.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true }
      );
      return { status: true, code: 200, data: updated };
    } catch (error) {
      log.error("updateUserByUserId error:", error);
      return { status: false, code: 500, data: null };
    }
  }
}

module.exports = new UserDemographicDao();
