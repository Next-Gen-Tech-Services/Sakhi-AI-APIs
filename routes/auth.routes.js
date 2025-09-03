const router = require("express").Router();
const authController = require("../controllers/auth.controller");

router.post("/request-otp", async (req, res) => {
  try {
    const result = await authController.requestOTP(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const result = await authController.verifyOTP(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});





//--------------------------------- FOLLOWING CODE WILL REMOVE

router.post("/register", async (req, res) => {
  try {
    const result = await authController.register(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await authController.login(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/googleLogin", async (req, res) => {
  try {
    const result = await authController.googleLogin(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/forgetPassword", async (req, res) => {
  try {
    const result = await authController.forgetPassword(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/resetPassword", async (req, res) => {
  try {
    const result = await authController.resetPassword(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
