const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const { generateOTP } = require("../utils/otpGen");
const { SEND_SMS } = require("../utils/smsSend");

class AuthMethods {
  static signup = async (req, res) => {
    let {
      firstName,
      lastName,

      userIBAN,
      bankName,
      bankAccount,

      phoneNumber,
      stateKey,
      email,
    } = req?.body;

    try {
      const avatar = getRandomColor();
      const user = await User.create({
        firstName,
        lastName,

        userIBAN,
        bankName,
        bankAccount,

        avatar,

        phoneNumber,
        stateKey,
        email,
      });
      const token = await user?.generateAuthToken();

      const popedUser = await User.findById(user?._id);
      //

      res.send({ token, user: popedUser });
    } catch (err) {
      return res
        .status(422)
        .send({ error: err?.message, message: "error in creating user" });
    }
  };

  static signinOTP = async (req, res) => {
    const { phoneNumber } = req?.body;
    console.log("HI I AM HERE signinOTP");
    try {
      const user = await User.findOne({ phoneNumber });

      if (!user) {
        return res.status(404).send({ error: "AuthCtrl/User Not Found" });
      }

      const otpGenerated = generateOTP();
      const token = await user?.generateAuthToken();
      const sendSMS = await SEND_SMS(user?.stateKey, phoneNumber, otpGenerated);

      res.send({ token, user, otp: otpGenerated });
    } catch (err) {
      return res
        .status(422)
        .send({ error: err?.message, message: "error in login" });
    }
  };
}

module.exports = AuthMethods;
