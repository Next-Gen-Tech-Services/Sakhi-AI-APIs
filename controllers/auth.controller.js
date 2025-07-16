const authService = require("../services/auth.service");

class AuthController {
  async requestOTP(req, res) {
    try {
      const result = await authService.requestOTPService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async verifyOTP(req, res) {
    try {
      const result = await authService.verifyOTPService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async register(req, res) {
    try {
      const result = await authService.registerService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async login(req, res) {
    try {
      const result = await authService.loginService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async googleLogin(req, res) {
    try {
      const result = await authService.googleLoginService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async forgetPassword(req, res) {
    try {
      const result = await authService.forgetPasswordService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(req, res) {
    try {
      const result = await authService.resetPasswordService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

}

module.exports = new AuthController();
