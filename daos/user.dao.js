const User = require("../models/user.model");
const getNextSequenceValue = require("../utils/helpers/counter.util");
const log = require("../configs/logger.config");
const { hashItem } = require("../utils/helpers/bcrypt.util");
class UserDao {
  async getUserById(id) {
    try {
      const user = await User.findOne({ userId: id });
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
      //create user
      const userId = "User_" + (await getNextSequenceValue("user"));
      data.userId = userId;
      let result;
      const user = new User(data);
      result = await user.save();

      log.info("User saved");
      if (!result) {
        log.error("Error from [USER DAO]: User creation error");
        throw error;
      } else {
        return {
          message: "User created successfully",
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
}

module.exports = new UserDao();
