const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema(
    {
        // chatId will help us to delete a particular chat in the thread?
        // else we can override _id just like we did in user_demographic to identify chats uniquely
        chatId: {
            type: String,
            required: true,
            unique: true,
        },
        user_id: {
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

// // Add index on chatId for fast lookup
// chatHistorySchema.index({ userId: 1 });
// chatHistorySchema.index({ threadId: 1 });
// chatHistorySchema.index({ userId: 1, threadId: 1 }); // compounding index for future perspective

// Add indexes for fast lookup
chatHistorySchema.index({ user_id: 1 });
chatHistorySchema.index({ threadId: 1 });
chatHistorySchema.index({ user_id: 1, threadId: 1 }); // compound index for future perspective

module.exports = mongoose.model("chat-history", chatHistorySchema);
