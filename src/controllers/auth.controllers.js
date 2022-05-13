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
      const user = await User.create({
        firstName,
        lastName,

        userIBAN,
        bankName,
        bankAccount,

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

    //  3. GenOTP func:
    //    Search for the user.
    //    Create a code
    //    send it as SMS
    //    store it in DB.
    //
    //  4. Verify func:
    //    check if user has entered code
    //    if not found show an error.
    //    generate a token and let the user in

    //

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

  static verify = async (req, res) => {
    const { phoneNumber, otp } = req?.body;

    const user = await User.findOne({ phoneNumber });
    // User not found, return a 404 error
    if (!user) {
      return res.status(404).send({ error: "AuthCtrl/User Not Found" });
    }
    if (user?.otp === otp) {
      const token = await user?.generateAuthToken();
      const popedUser = await User.findById(user?._id);
      res.send({ token, user: popedUser });
    } else {
      res.status(400).send({ error: "AuthCtrl/Wrong OTP" });
    }
  };

  static generateOTPbeforeSignup = async (req, res) => {
    const { phoneNumber } = req?.body;
    try {
      if (!phoneNumber) {
        return res
          .status(400)
          .send({ error: "AuthCtrl/Must provide your Phone Number" });
      }

      const otpGenerated = generateOTP();

      const sendSMS = await SEND_SMS(phoneNumber, otpGenerated);

      res.send({ otp: otpGenerated });
    } catch (err) {
      return res
        .status(422)
        .send({ error: err?.message, message: "error in generating OTP code" });
    }
  };

  static generateOTPbeforeSignin = async (req, res) => {
    const { phoneNumber } = req.body;
    try {
      if (!phoneNumber) {
        return res
          .status(400)
          .send({ error: "AuthCtrl/Must provide your Phone Number" });
      }
      const otpGenerated = generateOTP();

      const sendSMS = await SEND_SMS(phoneNumber, otpGenerated);

      res.send({ otp: otpGenerated });
    } catch (err) {
      return res
        .status(422)
        .send({ error: err?.message, message: "error in generating OTP code" });
    }
  };

  static signin = async (req, res) => {
    const { phoneNumber } = req?.body;
    // const otpGenerated = generateOTP();

    // If there is no phoneNumber in the request body, return a 400 error

    try {
      const user = await User.findOne({ phoneNumber });

      // User not found, return a 404 error
      if (!user) {
        return res.status(404).send({ error: "AuthCtrl/User Not Found" });
      }
      const token = await user?.generateAuthToken();

      const popedUser = await User.findById(user?._id);
      // res.send({ token, user: popedUser, otp: otpGenerated });
      res.send({ token, user: popedUser });
    } catch (err) {
      return res
        .status(422)
        .send({ error: err?.message, message: "error in generating token" });
    }
  };
}

module.exports = AuthMethods;
