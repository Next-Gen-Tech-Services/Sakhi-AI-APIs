const router = require("express").Router();
const messageRouter = require("./message.routes.js");
const msgThreadsRouter = require("./message.threads.routes.js");
const userDemographicController = require("../controllers/user.demographic.controller.js");
const jwt = require("../middlewares/auth.middleware.js");

// this is because msg threads belongs to user
// so ideally all routes /api/user/msg-threads/
router.use("/msg-threads", msgThreadsRouter);

// this is because messages belongs to user
// so ideally all routes /api/user/messsage/....
router.use("/message", messageRouter);






router.get("/get-profile", jwt.authenticateJWT, async (req, res) => {
    try {
        const result = await userDemographicController.getProfile(req, res);
        return result;
    } catch (error) {
        log.error("Internal Server Error: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/getAllConversation", jwt.authenticateJWT, async (req, res) => {
    try {
        const result = await userDemographicController.getAllConversation(req, res);
        return result;
    } catch (error) {
        log.error("Internal Server Error: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/update-profile", jwt.authenticateJWT, async (req, res) => {
    try {
        const result = await userDemographicController.updateProfile(req, res);
        return result;
    } catch (error) {
        log.error("Internal Server Error: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})


module.exports = router;