const userDao = require("../daos/user.demographic.dao");
const { compareItems, hashItem } = require("../utils/helpers/bcrypt.util");
const OTPDao = require("../daos/opt.dao");
const log = require("../configs/logger.config");
const { createToken, verifyToken } = require("../utils/helpers/tokenHelper.util");
const { validateEmail } = require("../utils/helpers/validator.util");
const { removeNullUndefined, randomString } = require("../utils/helpers/common.util");
const { sendMail } = require("../utils/helpers/email.util");
const axios = require("axios");
const messageHistoryDao = require("../daos/message.history.dao");
const messageThreadsDao = require("../daos/message.threads.dao");
const { v4: uuidv4 } = require("uuid");

// const dummyData = {
//     "hi": "Hello",
//     "hello": "Hi there!",
//     "how are you": "I'm good, how about you?",
//     "good morning": "Morning! Hope you have a great day!",
//     "good night": "Sweet dreams!",
//     "what's up": "Not much, you?",
//     "how's it going": "Pretty well!",
//     "yo": "Yo! What's good?",
//     "hey": "Hey there!",
//     "sup": "All good!",
//     "long time no see": "Yeah, it's been a while!",
//     "howdy": "Howdy partner!",
//     "greetings": "Salutations!",
//     "nice to meet you": "Pleasure's mine!",
//     "good afternoon": "Hope your afternoon's going well!",
//     "good evening": "Evening! How was your day?",
//     "what’s new": "Same old, same old.",
//     "how’s life": "Can't complain!",
//     "how’s your day": "Pretty productive, thanks!",
//     "how are things": "Things are good on my end!",
//     "yo bro": "Hey bro!",
//     "yo sis": "Hey sis!",
//     "hello friend": "Hello buddy!",
//     "hi there": "Hey!",
//     "how’s everything": "All smooth, you?",
//     "hey man": "Sup dude?",
//     "hey girl": "Hey hey!",
//     "miss you": "Aww, miss you too!",
//     "you there": "Always!",
//     "wassup": "Everything's cool!",
//     "hola": "¡Hola amigo!",
//     "bonjour": "Salut!",
//     "namaste": "Namaste!",
//     "hey buddy": "Hey champ!",
//     "morning": "Morning sunshine!",
//     "evening": "Good to see you this evening!",
//     "yo man": "What’s popping?",
//     "hi buddy": "Hey, what’s up?",
//     "hello again": "Hey! Back so soon?",
//     "hi hi": "Double hi!",
//     "hey again": "Welcome back!",
//     "how’s the day": "Busy but good!",
//     "sup man": "Chillin’!",
//     "all good": "Glad to hear!",
//     "yo yo": "Yo yo yo!",
//     "check in": "I’m here!",
//     "hi mate": "Hey mate!",
//     "g’day": "G’day to you too!",
//     "peace": "Peace and love!",
//     "shalom": "Shalom!",
//     "hi dude": "Yo dude!",
//     "hey there": "There you are!",
//     "aloha": "Aloha 🌺",
//     "whats poppin": "Just chillin’!",
//     "how’s work": "Busy but fine!",
//     "how’s school": "Learning every day!",
//     "what’s happening": "Just the usual!",
//     "what’s cracking": "Nothing crazy!",
//     "what’s cooking": "Just some code!",
//     "how are ya": "Feeling great!",
//     "how r u": "I’m alright, you?",
//     "yo buddy": "Yo what’s up?",
//     "welcome": "Thanks!",
//     "hi again": "Nice seeing you again!",
//     "hi stranger": "I’m no stranger now 😄",
//     "hi boss": "Hey boss!",
//     "yo chief": "What's good, chief?",
//     "hi king": "Bow down! 😂",
//     "yo queen": "All hail the queen!",
//     "hey folks": "Hey everyone!",
//     "what’s the word": "Peace ✌️",
//     "hi pal": "Hey pal!",
//     "hello mate": "Greetings, mate!",
//     "hi everyone": "Hey y’all!",
//     "hey fam": "Fam, what’s up?",
//     "yo team": "Team assemble!",
//     "hi captain": "Aye aye, captain!",
//     "yo legend": "You're the legend!",
//     "hi genius": "Flattery appreciated 😄",
//     "hello world": "Classic dev move!",
//     "hi friend": "Friend! Howdy!",
//     "hey hey hey": "What’s the vibe?",
//     "you good": "I’m great!",
//     "how’s your mood": "Feeling positive!",
//     "how’s it been": "Not bad at all!",
//     "hi sunshine": "Sunshine back at ya!",
//     "hey champ": "Ready to win!",
//     "hi star": "You’re the real star!",
//     "what’s going on": "Stuff and things!",
//     "you okay": "Yep, solid!",
//     "everything alright": "Absolutely!",
//     "yo yo yo": "Triple threat!",
//     "good to see you": "Good to see you too!",
//     "missed you": "Aww, right back atcha!",
//     "you rock": "You rock harder!",
//     "big hug": "Sending hugs 🤗",
//     "take care": "You too!",
//     "see you soon": "Count on it!",
//     "catch you later": "Later alligator!",
//     "bye for now": "Toodles!",
//     "talk later": "Talk soon!",
//     "hello you": "Well hello!",
//     "hey you": "Caught ya!",
// };

// input
/*
{
    "userId": "",
    "message: "
}
*/
// output
/*
{
"userId": "",
"message" ""
}
*/


// Self: Aakash MSG DAO is pending because sunil Sir just want functional api

const CHAT_BOT_URL = "https://chat-deployment.blackdesert-6a7b405b.centralindia.azurecontainerapps.io/message";
const dummyData = [
    {
        input: "hi",
        output: "hello"
    },
    {
        input: "what is good things about ngts?",
        output: "people, Ankit Sir and Akash Sir"
    },
    {
        input: "tell me about ngts",
        output: "NGTS is an amazing company with great learning opportunities."
    },
    {
        input: "who are best mentors in ngts?",
        output: "Ankit Sir and Akash Sir are the most appreciated mentors."
    },
    {
        input: "what technologies ngts use?",
        output: "NGTS works with Node.js, React, MongoDB, and AWS."
    },
    {
        input: "how is work culture in ngts?",
        output: "The work culture in NGTS is very collaborative and friendly."
    },
    {
        input: "any fun activities in ngts?",
        output: "Yes, NGTS hosts hackathons, outings, and birthday celebrations."
    },
    {
        input: "do people get growth in ngts?",
        output: "Absolutely! Growth is fast if you're proactive and consistent."
    },
    {
        input: "who is akash?",
        output: "Akash Sir is one of the key mentors at NGTS, very helpful and smart."
    },
    {
        input: "who is ankit?",
        output: "Ankit Sir is known for leadership and deep technical expertise."
    }
];


class MessageService {
    async sendMessageService(req, res) {
        try {
            const userId = req.userId;
            const { threadId: incomingThreadId, message, timestamp } = req.body;

            if (!userId || !message?.trim()) {
                return res.status(400).json({
                    message: "Message and userId are required",
                    status: "failed",
                    data: null,
                    code: 400,
                });
            }

            const trimmedMessage = message.trim();
            const matched = dummyData.find(entry => entry.input === trimmedMessage);
            const outputMessage = matched
                ? matched.output
                : "I'm sorry, I don't have an answer for that yet.";

            let threadId = incomingThreadId?.trim();
            let createdThread = null;

            // Step 1: Create new thread if not provided
            if (!threadId) {
                const threadResp = await messageThreadsDao.createThread({
                    userId,
                    title: trimmedMessage.substring(0, 25),
                    messageCount: 0,
                });

                if (threadResp?.status !== "success") {
                    return res.status(500).json({
                        message: "Failed to create thread",
                        status: "failed",
                        data: null,
                        code: 500,
                    });
                }

                threadId = threadResp.data.threadId;
                createdThread = threadResp.data;
            } else {
                const existingThread = await messageThreadsDao.getThreadByThreadId(threadId);
                if (!existingThread?.data) {
                    return res.status(404).json({
                        message: "Thread not found",
                        status: "failed",
                        data: null,
                        code: 404,
                    });
                }
            }

            // Step 2: Save user message
            const userChatId = `Message-${uuidv4()}`;
            const userMsgResp = await messageHistoryDao.createMessage({
                userId,
                threadId,
                chatId: userChatId,
                sender: "user",
                message: trimmedMessage,
                timestamp: new Date(timestamp),
            });

            if (userMsgResp?.status !== "success") {
                if (createdThread) await messageThreadsDao.deleteThreadByThreadId(threadId);
                return res.status(500).json({
                    message: "Failed to save user message",
                    status: "failed",
                    data: null,
                    code: 500,
                });
            }

            const userMessage = userMsgResp.data;

            // Step 3: Save assistant message
            const assistantChatId = `Message-${uuidv4()}`;
            const assistantMsgResp = await messageHistoryDao.createMessage({
                userId,
                threadId,
                chatId: assistantChatId,
                sender: "assistant",
                message: outputMessage,
                timestamp: new Date(),
            });

            if (assistantMsgResp?.status !== "success") {
                await messageHistoryDao.deleteMessageById(userMessage._id);
                if (createdThread) await messageThreadsDao.deleteThreadByThreadId(threadId);

                return res.status(500).json({
                    message: "Failed to save assistant message",
                    status: "failed",
                    data: null,
                    code: 500,
                });
            }

            // ✅ Step 4: Increment messageCount (+2)
            const countResp = await messageThreadsDao.incrementMessageCount(threadId, 2);
            if (countResp?.status !== "success") {
                // Rollback messages
                await messageHistoryDao.deleteMessageById(userMessage._id);
                await messageHistoryDao.deleteMessageById(assistantMsgResp.data._id);
                if (createdThread) await messageThreadsDao.deleteThreadByThreadId(threadId);

                return res.status(500).json({
                    message: "Failed to update thread count",
                    status: "failed",
                    data: null,
                    code: 500,
                });
            }

            return res.status(200).json({
                message: "Message sent successfully",
                status: "success",
                data: {
                    threadId,
                    responseMessage: assistantMsgResp.data.message,
                    messageId: assistantMsgResp.data.chatId,
                },
                code: 200,
            });

        } catch (error) {
            log.error("Service Error [sendMessageService]:", error);
            return res.status(500).json({
                message: "Internal Server Error",
                status: "failed",
                data: null,
                code: 500,
            });
        }
    }
}

module.exports = new MessageService();
