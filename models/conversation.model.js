const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        enum: ["user", "agent"], required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
});

module.exports = mongoose.model("Conversation", conversationSchema);
