const router = require("express").Router();
const jwt = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller.js");

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

module.exports = router;