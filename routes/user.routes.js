const router = require("express").Router();
const messageRouter = require("./message.routes.js");
const userController = require("../controllers/user.controller.js");
const jwt = require("../middlewares/auth.middleware");


// this is because messages belongs to user
// so ideally all routes /api/user/messsage/....
router.use("/message", messageRouter);


/**
 * @swagger
 * /api/user/getAllConversation:
 *   get:
 *     summary: Fetch all conversation messages (mock, protected)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all conversation messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fetched all conversations
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1"
 *                       sender:
 *                         type: string
 *                         example: "user"
 *                       message:
 *                         type: string
 *                         example: "Hi, I need help with my order."
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-08T10:00:00Z"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 status:
 *                   type: string
 *                   example: failed
 *                 code:
 *                   type: integer
 *                   example: 401
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 status:
 *                   type: string
 *                   example: failed
 *                 code:
 *                   type: integer
 *                   example: 500
 */
router.get("/getAllConversation", jwt.authenticateJWT, async (req, res) => {
    try {
        const result = await userController.getAllConversation(req, res);
        return result;
    } catch (error) {
        log.error("Internal Server Error: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


/**
 * @swagger
 * /api/user/getProfile:
 *   get:
 *     summary: Get current user's profile
 *     description: Retrieves the profile details of the logged-in user based on the JWT token.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User found"
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64ab2349f4d70c2b6a07df91"
 *                     name:
 *                       type: string
 *                       example: "Aakash"
 *                     email:
 *                       type: string
 *                       example: "aakash@example.com"
 *                     mobile:
 *                       type: string
 *                       example: "9876543210"
 *                     gender:
 *                       type: string
 *                       example: "MALE"
 *                     userId:
 *                       type: string
 *                       example: "User_0012"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 code:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: User ID not found in token"
 *                 status:
 *                   type: string
 *                   example: "failed"
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 code:
 *                   type: integer
 *                   example: 401
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 status:
 *                   type: string
 *                   example: "failed"
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 code:
 *                   type: integer
 *                   example: 500
 */

router.get("/get-profile", jwt.authenticateJWT, async (req, res) => {
    try {
        const result = await userController.getProfile(req, res);
        return result;
    } catch (error) {
        log.error("Internal Server Error: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


/**
 * @swagger
 * /api/user/update-profile:
 *   put:
 *     summary: Update user profile
 *     description: Allows an authenticated user to update their profile information. If the provided email already exists for another account, it returns a conflict error.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Gautam Updahyay
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 2000-04-01
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: Profile updated successfully
 *                 status: success
 *                 code: 200
 *       401:
 *         description: Unauthorized - JWT token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: Unauthorized
 *                 status: fail
 *                 code: 401
 *                 data: null
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: User not found
 *                 status: fail
 *                 code: 404
 *                 data: null
 *       409:
 *         description: Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: Email already in use
 *                 status: fail
 *                 code: 409
 *                 data: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: Internal server error
 *                 status: error
 *                 code: 500
 *                 data: null
 */

router.put("/update-profile", jwt.authenticateJWT, async (req, res) => {
    try {
        const result = await userController.updateProfile(req, res);
        return result;
    } catch (error) {
        log.error("Internal Server Error: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})


module.exports = router;