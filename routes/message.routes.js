const router = require("express").Router();
const messageRouter = require("express").Router();
const messageController = require("../controllers/message.controller");

/**
 * @swagger
 * /api/user/message:
 *   post:
 *     summary: Get a response for a user message
 *     description: |
 *       Sends a message and receives a predefined response.
 *       
 *       🔹 Supported Messages:
 *       - hi → Hello
 *       - hello → Hi there!
 *       - how are you → I'm good, how about you?
 *       - good morning → Morning! Hope you have a great day!
 *       - good night → Sweet dreams!
 *       - yo bro → Hey bro!
 *       - peace → Peace and love!
 *       - what's up → Not much, you?
 *       - are you real → As real as it gets!
 *       - who are you → I'm your assistant
 *       - tell me a joke → Why don’t scientists trust atoms? Because they make up everything.
 *       - what is love → Baby don't hurt me 🎵
 *       - do you sleep → Only when the server is down.
 *       - your name → I'm ChatBot.
 *       - ping → pong
 *       - say something → Something 😄
 *       - ok → Got it.
 *       - thank you → You're welcome!
 *       - lol → 😂
 *       - bye → Goodbye!
 *
 *     tags:
 *       - Message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - message
 *             properties:
 *               userId:
 *                 type: string
 *                 example: USR123
 *               message:
 *                 type: string
 *                 example: hi
 *     responses:
 *       200:
 *         description: Predefined message response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: Message fetched successfully
 *                 status: success
 *                 code: 200
 *                 data:
 *                   userId: USR123
 *                   message: Hello
 */

router.post("/", async (req, res) => {
    try {
        const result = await messageController.getMessage(req, res);
        return result;
    } catch (error) {
        log.error("Internal Server Error: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;