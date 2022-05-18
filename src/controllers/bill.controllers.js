const express = require("express");
const mongoose = require("mongoose");
const Bill = mongoose.model("Bill");
const User = mongoose.model("User");

class BillMethods {
  static addNewBill = async (req, res) => {
    const { name, allMembers, totalAmount } = req?.body;

    const user = req?.user;
    try {
      const bill = await Bill.create({
        name,
        owner: user?._id,
        allMembers,
        totalAmount,
      });

      const membersWithOwner = [
        ...allMembers,
        { member: user?._id?.toString() },
      ];

      // Update members
      membersWithOwner?.forEach(async ({ member }) => {
        //

        const updatedMember = await User.findByIdAndUpdate(
          { _id: member },
          { $push: { activeBills: bill?._id } }
        );
      });

      const popedBill = await Bill.findById(bill?._id);
      const popedUser = await User.findById(user?._id);

      res.send({ bill: popedBill, user: popedUser });
    } catch (err) {
      res.status(422).send({ error: err?.message });
    }
  };

  static payMyPart = async (req, res, next) => {
    const currentUserId = req?.user?._id;

    const { billId } = req?.body;

    try {
      const foundBill = await Bill.findById(billId);

      let isErrored = false;
      if (!foundBill) {
        throw new Error("Bill not found");
      }
      await foundBill?.allMembers?.forEach(async (index) => {
        const userId = index?.member?._id;

        try {
          if (userId?.toString() === currentUserId?.toString()) {
            // check if the user has already paid
            if (index?.isPaid) {
              throw new Error("");
            }
            // Change the status of the member to paid
            index.isPaid = await true;

            // Update the member transactions history
            const memberToUpdate = await User.findById(userId);
            memberToUpdate?.transactions?.unshift({
              billId,
              name: foundBill?.name,
              kind: "فاتورة",
              amount: foundBill?.singlePayment,
              type: "pay",
            });

            // Update the receiver transactions history
            const receiverToUpdate = await User.findByIdAndUpdate(
              foundBill?.owner
            );
            receiverToUpdate?.transactions?.unshift({
              billId,
              name: foundBill?.name,
              kind: "فاتورة",
              amount: foundBill?.singlePayment,
              type: "receive",
            });
            await memberToUpdate.save();
            await receiverToUpdate.save();
          }
        } catch (error) {
          isErrored = true;

          res.status(500).send({ error: "You have already paid" });
        }
      });

      // Update needToBePaid status

      foundBill.needToBePaid -= await foundBill?.singlePayment;

      if (foundBill?.needToBePaid <= 0) {
        foundBill.isDone = true;
      }
      await foundBill.save();

      const popedBill = await Bill.findById(billId);
      const popedUser = await User.findById(currentUserId);

      !isErrored && res.status(200).send({ bill: popedBill, user: popedUser });
    } catch (error) {
      res.status(500).send(error?.message);
    }
  };

  static endBill = async (req, res, next) => {
    const currentUserId = req?.user?._id;

    const { billId } = req?.body;
    try {
      const foundBill = await Bill.findById(billId);

      let isErrored = false;
      if (!foundBill) {
        throw new Error("Bill not found");
      }

      foundBill.isDone = true;

      await foundBill.save();

      const popedBill = await Bill.findById(billId);
      const popedUser = await User.findById(currentUserId);

      !isErrored && res.status(200).send({ bill: popedBill, user: popedUser });
    } catch (error) {
      res.status(500).send(error?.message);
    }
  };

  static billbyId = async (req, res) => {
    const currentUserId = req?.user?._id;
    const billId = req?.params?.billId;
    try {
      const foundBill = await Bill.findById(billId);

      if (!foundBill) {
        throw new Error("Bill not found");
      }

      res.status(200).send(foundBill);
    } catch (err) {
      res.status(500).send(err?.message);
    }
  };

  static rating = async (req, res) => {
    const currentUserId = req?.user?._id;
    const { billId, rating } = req?.body;
    try {
      const foundBill = await Bill.findById(csgId);

      if (!foundBill) {
        throw new Error("Bill not found");
      }

      // set current user is rate to true
      foundBill?.rates?.forEach((el) => {
        if (el?.member?.toString() === currentUserId?.toString()) {
          el.isRate = true;
        }
      });

      await foundBill.save();

      const popedBill = await Bill.findById(billId);
      const popedUser = await User.findById(currentUserId);

      res.status(200).send({ bill: foundBill, user: popedUser });
    } catch (err) {
      res.status(500).send(err?.message);
    }
  };
}

module.exports = BillMethods;
