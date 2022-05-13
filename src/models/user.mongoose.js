const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const getRandomColor = require("../utils/randomColorGen");

// const Csg = require("./csg.mongoose");
// const Invoice = require("./invoice.mongoose");

const Schema = mongoose.Schema;

const transactionsSchema = new Schema(
  {
    csgId: { type: Schema.ObjectId, ref: "Csg", autopopulate: { maxDepth: 1 } },
    billId: {
      type: Schema.ObjectId,
      ref: "Bill",
      autopopulate: { maxDepth: 1 },
    },
    name: String,
    kind: String,
    amount: Number,
    type: String,
  },
  {
    timestamps: true,
  }
);

const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    stateKey: {
      type: Number,
      default: 966,
    },

    email: {
      type: String,
      // unique: true,
      // required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    rate: {
      type: Number,
      default: 0,
    },
    rateCount: {
      type: Number,
      default: 4,
    },
    bankName: {
      type: String,
      // required: true,
    },
    userIBAN: {
      type: String,
      // required: true,
    },
    bankAccount: {
      type: Number,
    },
    avatar: {
      type: String,
      default: getRandomColor(),
    },
    friends: [
      { type: Schema.ObjectId, ref: "User", autopopulate: { maxDepth: 1 } },
    ],
    transactions: [transactionsSchema],
    activeCsgs: [
      { type: Schema.ObjectId, ref: "Csg", autopopulate: { maxDepth: 2 } },
    ],
    activeBills: [
      { type: Schema.ObjectId, ref: "Bill", autopopulate: { maxDepth: 2 } },
    ],
    token: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET
  );

  //

  user.token = token;
  await user.save();

  return token;
};

userSchema.plugin(require("mongoose-autopopulate"));

const User = mongoose.model("User", userSchema);
module.exports = User;
