const router = require("express").Router();
const messageRouter = require("express").Router();
const messageController = require("../controllers/message.controller");
const jwt = require("../middlewares/auth.middleware");

router.post("/", jwt.authenticateJWT, async (req, res) => {
    try {
        const result = await messageController.sendMessage(req, res);
        return result;
    } catch (error) {
        log.error("Internal Server Error: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;