const mongoose = require("mongoose");

const messageThreadsSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true,
        },
        threadId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        messageCount: {
            type: Number,
            required: true,
            default: 0, // start with zero messages
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("message-thread", messageThreadsSchema);
