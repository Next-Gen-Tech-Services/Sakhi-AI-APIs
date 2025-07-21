const router = require("express").Router();
const authController = require("../controllers/auth.controller");

/**
 * @swagger
 * /api/request-otp:
 *   post:
 *     summary: Request an OTP for login or registration via mobile number
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *             properties:
 *               mobile:
 *                 type: string
 *                 description: User's mobile number (10-digit format)
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: User_101
 *                     mobile:
 *                       type: string
 *                       example: "9876543210"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Mobile number is missing in the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mobile number is required
 *                 status:
 *                   type: string
 *                   example: failed
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 code:
 *                   type: integer
 *                   example: 400
 *       500:
 *         description: Internal server error or user creation failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 status:
 *                   type: string
 *                   example: failed
 *                 code:
 *                   type: integer
 *                   example: 500
 *     security: []
 */
router.post("/request-otp", async (req, res) => {
  try {
    const result = await authController.requestOTP(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and log in user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *               - otp
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               otp:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: OTP verified and token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     mobile:
 *                       type: string
 *                     name:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *       400:
 *         description: Missing mobile or OTP
 *       401:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Internal server error
 */
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
