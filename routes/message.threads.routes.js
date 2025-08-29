const jwt = require("../middlewares/auth.middleware");
const router = require("express").Router();
const messageThreadsController = require("../controllers/message.threads.controller");


router.get("/fetch-msg-threads", jwt.authenticateJWT, async (req, res) => {
    try {
        const result = await messageThreadsController.getAllThreads(req, res);
        return result;
    } catch (error) {
        log.error("Internal Server Error: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/fetch-messages/:threadId", jwt.authenticateJWT, async (req, res) => {
    try {
        const result = await messageThreadsController.getAllMessageFromThreads(req, res);
        return result;
    } catch (error) {
        log.error("Internal Server Error: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.patch("/rename-thread/:threadId", jwt.authenticateJWT, async (req, res) => {
    try {
        const result = await messageThreadsController.renameThreadByThreadId(req, res);
        return result;
    } catch (error) {
        log.error("Internal Server Error: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/delete-thread/:threadId", jwt.authenticateJWT, async (req, res) => {
    try {
        const result = await messageThreadsController.deleteThreadByThreadId(req, res);
        return result;
    } catch (error) {
        log.error("Internal Server Error: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;