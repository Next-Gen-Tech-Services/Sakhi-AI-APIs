const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema(
    {
        chatId: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: String,
            required: true,
            index: true,
        },
        threadId: {
            type: String,
            required: true,
        },
        sender: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: "chat-history",
    }
);

// Add index on chatId for fast lookup
chatHistorySchema.index({ chatId: 1 });

module.exports = mongoose.model("chat-history", chatHistorySchema);
