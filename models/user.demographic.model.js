const mongoose = require("mongoose");
const { MALE, FEMALE, OTHER } = require("../utils/constants/gender.constant");
const { MOBILE, EMAIL, GOOGLE } = require("../utils/constants/via.constant");
const {
  ENGLISH, HINDI, BENGALI, TAMIL, TELUGU, MARATHI, GUJARATI,
  KANNADA, MALAYALAM, ORIYA, PUNJABI, ASSAMESE, MAITHILI, URDU,
  KASHMIRI, KONKANI, MANIPURI, SANSKRIT, SANTHALI, DOGRI, NEPALI, BODO, SINDHI
} = require("../utils/constants/language.constant");
const { FREE_TIER, PREMIUM_TIER } = require("../utils/constants/tier.constant");

const userDemographicSchema = mongoose.Schema(
  {
    _id: {
      type: String, // UUID will be a string
      trim: true,
      required: true,
    },
    // this will be deleted in future because M.L engineer change, So I have to check relevent APIs is it using userId or not
    userId: {
      type: String,
      trim: true,
      required: true,
      unique: true, // Ensures userId is unique
    },
    name: {
      type: String,
      trim: true,
      default: ""
    },
    mobile: {
      type: String,
      required: true,
      unique: true, // Unique index
    },
    email: {
      type: String,
      required: false,
      default: "",
    },
    gender: {
      type: String,
      enum: [MALE, FEMALE, OTHER],
      default: MALE
    },
    via: {
      type: String,
      required: true,
      enum: [MOBILE, EMAIL, GOOGLE],
    },
    preferredLanguage: {
      type: String,
      enum: [
        ENGLISH, HINDI, BENGALI, TAMIL, TELUGU, MARATHI, GUJARATI,
        KANNADA, MALAYALAM, ORIYA, PUNJABI, ASSAMESE, MAITHILI, URDU,
        KASHMIRI, KONKANI, MANIPURI, SANSKRIT, SANTHALI, DOGRI, NEPALI, BODO, SINDHI,
      ],
      default: ENGLISH,
    },
    tier: {
      type: String,
      enum: [FREE_TIER, PREMIUM_TIER],
      default: FREE_TIER,
    },
    age: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    collection: "user-demographics",
  }
);

// Add compound or additional indexes
userDemographicSchema.index({ userId: 1 }, { unique: true }); // Optional if already declared above
userDemographicSchema.index({ mobile: 1 }, { unique: true }); // Optional if already declared above

module.exports = mongoose.model("user-demographics", userDemographicSchema);
