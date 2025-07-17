const userDao = require("../daos/user.dao");
const { compareItems, hashItem } = require("../utils/helpers/bcrypt.util");
const OTPDao = require("../daos/opt.dao");
const log = require("../configs/logger.config");
const { createToken, verifyToken } = require("../utils/helpers/tokenHelper.util");
const { validateEmail } = require("../utils/helpers/validator.util");
const { removeNullUndefined, randomString } = require("../utils/helpers/common.util");
const { sendMail } = require("../utils/helpers/email.util");

const dummyData = {
    "hi": "Hello",
    "hello": "Hi there!",
    "how are you": "I'm good, how about you?",
    "good morning": "Morning! Hope you have a great day!",
    "good night": "Sweet dreams!",
    "what's up": "Not much, you?",
    "how's it going": "Pretty well!",
    "yo": "Yo! What's good?",
    "hey": "Hey there!",
    "sup": "All good!",
    "long time no see": "Yeah, it's been a while!",
    "howdy": "Howdy partner!",
    "greetings": "Salutations!",
    "nice to meet you": "Pleasure's mine!",
    "good afternoon": "Hope your afternoon's going well!",
    "good evening": "Evening! How was your day?",
    "what’s new": "Same old, same old.",
    "how’s life": "Can't complain!",
    "how’s your day": "Pretty productive, thanks!",
    "how are things": "Things are good on my end!",
    "yo bro": "Hey bro!",
    "yo sis": "Hey sis!",
    "hello friend": "Hello buddy!",
    "hi there": "Hey!",
    "how’s everything": "All smooth, you?",
    "hey man": "Sup dude?",
    "hey girl": "Hey hey!",
    "miss you": "Aww, miss you too!",
    "you there": "Always!",
    "wassup": "Everything's cool!",
    "hola": "¡Hola amigo!",
    "bonjour": "Salut!",
    "namaste": "Namaste!",
    "hey buddy": "Hey champ!",
    "morning": "Morning sunshine!",
    "evening": "Good to see you this evening!",
    "yo man": "What’s popping?",
    "hi buddy": "Hey, what’s up?",
    "hello again": "Hey! Back so soon?",
    "hi hi": "Double hi!",
    "hey again": "Welcome back!",
    "how’s the day": "Busy but good!",
    "sup man": "Chillin’!",
    "all good": "Glad to hear!",
    "yo yo": "Yo yo yo!",
    "check in": "I’m here!",
    "hi mate": "Hey mate!",
    "g’day": "G’day to you too!",
    "peace": "Peace and love!",
    "shalom": "Shalom!",
    "hi dude": "Yo dude!",
    "hey there": "There you are!",
    "aloha": "Aloha 🌺",
    "whats poppin": "Just chillin’!",
    "how’s work": "Busy but fine!",
    "how’s school": "Learning every day!",
    "what’s happening": "Just the usual!",
    "what’s cracking": "Nothing crazy!",
    "what’s cooking": "Just some code!",
    "how are ya": "Feeling great!",
    "how r u": "I’m alright, you?",
    "yo buddy": "Yo what’s up?",
    "welcome": "Thanks!",
    "hi again": "Nice seeing you again!",
    "hi stranger": "I’m no stranger now 😄",
    "hi boss": "Hey boss!",
    "yo chief": "What's good, chief?",
    "hi king": "Bow down! 😂",
    "yo queen": "All hail the queen!",
    "hey folks": "Hey everyone!",
    "what’s the word": "Peace ✌️",
    "hi pal": "Hey pal!",
    "hello mate": "Greetings, mate!",
    "hi everyone": "Hey y’all!",
    "hey fam": "Fam, what’s up?",
    "yo team": "Team assemble!",
    "hi captain": "Aye aye, captain!",
    "yo legend": "You're the legend!",
    "hi genius": "Flattery appreciated 😄",
    "hello world": "Classic dev move!",
    "hi friend": "Friend! Howdy!",
    "hey hey hey": "What’s the vibe?",
    "you good": "I’m great!",
    "how’s your mood": "Feeling positive!",
    "how’s it been": "Not bad at all!",
    "hi sunshine": "Sunshine back at ya!",
    "hey champ": "Ready to win!",
    "hi star": "You’re the real star!",
    "what’s going on": "Stuff and things!",
    "you okay": "Yep, solid!",
    "everything alright": "Absolutely!",
    "yo yo yo": "Triple threat!",
    "good to see you": "Good to see you too!",
    "missed you": "Aww, right back atcha!",
    "you rock": "You rock harder!",
    "big hug": "Sending hugs 🤗",
    "take care": "You too!",
    "see you soon": "Count on it!",
    "catch you later": "Later alligator!",
    "bye for now": "Toodles!",
    "talk later": "Talk soon!",
    "hello you": "Well hello!",
    "hey you": "Caught ya!",
};

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

class MessageService {
    async getMessageService(req, res) {
        try {
            const { userId: token, message } = req.body;

            if (!token || !message) {
                return res.status(400).json({
                    message: "Invalid Request",
                    status: "failed",
                    code: 400,
                    data: null,
                });
            }

            const payload = verifyToken(token);
            const user = await userDao.getUserById(payload.userId);

            if (!user || !user.data || user.code === 201) {
                log.error("Error from [MessageService -> getMessageService]: User not found");
                return res.status(403).json({
                    message: "Unauthorized",
                    status: "failed",
                    code: 403,
                    data: null,
                });
            }

            const reply = dummyData[message.toLowerCase()] || "Sorry, I didn't understand that.";

            return res.status(200).json({
                message: "Message fetched successfully",
                status: "success",
                code: 200,
                data: {
                    userId: token,
                    message: reply,
                },
            });
        } catch (error) {
            log.error("Error from [MessageService -> getMessageService]:", error);
            return res.status(500).json({
                message: "Internal Server Error",
                status: "failed",
                code: 500,
                data: null,
            });
        }
    }
}

module.exports = new MessageService();
