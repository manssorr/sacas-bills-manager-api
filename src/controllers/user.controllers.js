const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");
const Bill = mongoose.model("Bill");
const Csg = mongoose.model("Csg");

class UserMethods {
  static editUser = async (req, res, next) => {
    const currentUser = req?.user;
    const id = currentUser?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: `❌ invalid user ID!`,
      });
    }

    try {
      const UpdatedUser = await User.findByIdAndUpdate(id, req?.body, {
        new: true,
      });

      if (!UpdatedUser) return res.status(500).send("User not found!");

      res.status(200).send(UpdatedUser);
    } catch (err) {
      return res.status(304).send({
        error: err?.message,
        message: "error in updating user",
      });
    }
  };

  static addFriendByNum = async (req, res) => {
    // apiUrl + url is dead 🪦

    try {
      const currentUser = req?.user;
      const { phoneNumber } = req?.body;

      const friendNumber = phoneNumber;

      if (currentUser?.phoneNumber === friendNumber) {
        return res.status(400).send({
          message: `❌ You can't add yourself as a friend!`,
        });
      }

      const user = await User.findById(currentUser._id);
      const friend = await User.findOne({
        phoneNumber: friendNumber,
      });

      await user?.friends?.push(friend?._id);

      await friend?.friends?.push(user?._id);

      await user.save();
      await friend.save();

      res.status(200).send(user);

      // res.status(200).send({
      //   message: "friend added",
      // });
    } catch (err) {
      res.status(500).send({
        error: err?.message,
        message: "error in adding friend",
      });
    }
  };

  static byNum = async (req, res) => {
    const { phoneNumber } = req?.body;
    //
    try {
      const user = await User.findOne({ phoneNumber });
      //

      // User not found, return a 404 error
      if (!user) {
        return res.status(404).send({ error: "AuthCtrl/User Not Found" });
      }

      res.status(200).send(user);
    } catch (err) {
      res.status(500).send({
        error: err?.message,
        message: "error in finding user by number",
      });
    }
  };

  static byId = async (req, res) => {
    const { id } = req?.body;
    try {
      const user = await User.findById(id);

      res.status(200).send(user);
    } catch (err) {
      res.status(500).send({
        error: err?.message,
        message: "error in finding user by number",
      });
    }
  };

  static getAllUsers = async (req, res) => {
    try {
      const users = await User.find({});

      res.status(200).send(users);
    } catch (err) {
      res.status(500).send({
        error: err?.message,
        message: "error in getting all users to search",
      });
    }
  };

  static rateUsers = async (req, res) => {
    try {
      const currentUser = req?.user;
      const { users, paidId, type } = req?.body;
      //
      // Loop on each membber and add rate to them
      // Go to the csg & bill and change the member status to rated

      // Loop on each memeber of the array
      users?.forEach(async (user) => {
        const { userId, rateValue } = user;
        const userToRate = await User.findById(userId);

        const totalRate = userToRate?.rate + rateValue;
        userToRate.rateCount += 1;

        // Make the new value of the rate the AVG
        userToRate.rate = (totalRate / userToRate?.rateCount)?.toFixed();

        await userToRate.save();
      });

      // Mark the user as rated at the csg or bill
      if (type === "bill") {
        const bill = await Bill.findById(paidId);

        bill?.rates?.forEach(async (user) => {
          if (user?.member?.toString() === currentUser?._id?.toString()) {
            // if user rated before
            if (user?.isRate) {
              return res.status(400).send(`You have already rated this Bill!`);
            } else {
              user.isRate = true;
              await bill.save();
              return res.status(200).send({
                message: "bill rated",
              });
            }
          }
        });
      }

      if (type === "csg") {
        const csg = await Csg.findById(paidId);

        csg?.rates?.forEach(async (user) => {
          if (user?.member?.toString() === currentUser?._id?.toString()) {
            // if user rated before
            if (user?.isRate) {
              return res.status(400).send(`You have already rated this Csg!`);
            } else {
              user.isRate = true;
              await csg.save();
              return res.status(200).send({
                message: "Csg rated",
              });
            }
          }
        });
      }
    } catch (e) {
      res.status(500).send({
        errors: e?.message,
        message: "error in rating user",
      });
    }
  };
}

module.exports = UserMethods;
