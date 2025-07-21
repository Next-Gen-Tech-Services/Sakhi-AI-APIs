const mongoose = require("mongoose");
const { MALE, FEMALE, OTHER } = require("../utils/constants/gender.constant");
const { MOBILE, EMAIL, GOOGLE } = require("../utils/constants/via.constant");
const { ENGLISH,
  HINDI,
  BENGALI,
  TAMIL,
  TELUGU,
  MARATHI,
  GUJARATI,
  KANNADA,
  MALAYALAM,
  ORIYA,
  PUNJABI,
  ASSAMESE,
  MAITHILI,
  URDU,
  KASHMIRI,
  KONKANI,
  MANIPURI,
  SANSKRIT,
  SANTHALI,
  DOGRI,
  NEPALI,
  BODO,
  SINDHI } = require("../utils/constants/language.constant");
const { FREE_TIER,
  TIER_1,
  TIER_2,
  TIER_3,
  PREMIUM_TIER } = require("../utils/constants/tier.constant");


const userSchema = mongoose.Schema(
  {
    // userId we can use primary key with name or IN NOSQL _id + name?
    userId: {
      type: String,
      trim: true,
      required: true
    },
    name: {
      type: String,
      trim: true,
      default: ""
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
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
      enum: [MOBILE, EMAIL, GOOGLE], // for future proof
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
      enum: [FREE_TIER, TIER_1, TIER_2, TIER_3, PREMIUM_TIER],
      default: FREE_TIER,
    },
    age: {
      type: Number,
      default: 0
    }
    // Age, locale Tier, Preferred Language
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
