const express = require("express");
const mongoose = require("mongoose");
const Csg = mongoose.model("Csg");
const User = mongoose.model("User");

class CsgMethods {
  static addNewCsg = async (req, res) => {
    const { name, allMembers, monthlyShare } = req.body;
    const user = req?.user;
    try {
      const csg = await Csg.create({
        name,
        owner: user?._id,
        allMembers,
        monthlyShare,
      });

      // Update members
      csg?.allMembers?.forEach(async ({ member }) => {
        const updatedMember = await User?.findByIdAndUpdate(
          { _id: member?._id },
          { $push: { activeCsgs: csg?._id } },
          { new: true }
        );
      });

      const popedCsg = await Csg.findById(csg?._id);
      const popedUser = await User.findById(user?._id);
      res.send({ csg: popedCsg, user: popedUser });
    } catch (err) {
      res.status(422).send({ error: err?.message });
    }
  };

  static payMonthlyShare = async (req, res, next) => {
    const currentUserId = req?.user?._id;

    const { cycleNo, _id } = req?.body;
    const cycleIndex = cycleNo - 1;

    //

    try {
      const foundCsg = await Csg.findById(_id);
      const foundCycle = foundCsg?.cycles[cycleIndex];
      let isErrored = false;
      if (!foundCsg) {
        throw new Error("Csg not found");
      }

      await foundCycle?.members?.forEach(async (index) => {
        const userId = index?.member?._id;
        //
        try {
          if (userId?.toString() === currentUserId?.toString()) {
            // check if the user has already paid
            if (index?.isPaid) {
              //
              throw new Error("");
            }
            // Change the status of the member to paid
            // ///////////////////////////////
            // index.isPaid = true;

            // Update the member transactions history
            const memberToUpdate = await User.findById(userId);

            console.log(memberToUpdate?.firstName);

            memberToUpdate?.transactions?.unshift({
              csgId: foundCsg?._id,
              name: foundCsg?.name,
              kind: "جمعية",
              amount: foundCsg?.monthlyShare,
              type: "pay",
            });

            await memberToUpdate.save();
            // Update the receiver transactions history

            const receiverToUpdate = await User.findById(foundCycle?.receiver);
            receiverToUpdate?.transactions?.unshift({
              csgId: foundCsg?._id,
              name: foundCsg?.name,
              kind: "جمعية",
              amount: foundCsg?.monthlyShare,
              type: "receive",
            });

            console.log(receiverToUpdate?.firstName);

            await receiverToUpdate.save();
          }
        } catch (error) {
          isErrored = true;

          res.status(500).send({ error: "You have already paid" });
        }
      });

      // Update isDone status
      // ///////////////////////////////
      // foundCycle.payCount += 1;

      // IF THIS IS THE LASR MEMEBER TO PAY END THIS CYCLE
      if (foundCycle?.payCount >= foundCycle?.members?.length - 1) {
        foundCycle.isDone = true;
        if (foundCycle?.isLast) {
          foundCsg.isDone = true;
        }
      }

      // IF THIS IS THE LASR CYCLE & LASR MEMEBER TO PAY END THIS CSG

      await foundCsg.save();
      const popedCsg = await Csg.findById(foundCsg?._id);
      const popedUser = await User.findById(currentUserId);
      !isErrored && res.status(200).send({ csg: popedCsg, user: popedUser });
    } catch (error) {
      res.status(500).send(error?.message);
    }
  };

  static endCycle = async (req, res, next) => {
    const currentUserId = req?.user?._id;

    const { cycleNo, _id } = req?.body;
    const cycleIndex = cycleNo - 1;

    try {
      const foundCsg = await Csg.findById(_id);
      const foundCycle = foundCsg?.cycles[cycleIndex];

      let isErrored = false;
      if (!foundCsg) {
        throw new Error("Csg not found");
      }

      foundCycle.isDone = true;

      //Check if this is the last cycle
      // if yes end the whole csg
      if (foundCycle?.isLast) {
        foundCsg.isDone = true;
      }

      await foundCsg.save();
      const popedCsg = await Csg.findById(foundCsg?._id);
      const popedUser = await User.findById(currentUserId);
      !isErrored && res.status(200).send({ csg: popedCsg, user: popedUser });
    } catch (error) {
      res.status(500).send(error?.message);
    }
  };

  static endCsg = async (req, res, next) => {
    const currentUserId = req?.user?._id;

    const { csgId } = req?.body;

    try {
      const foundCsg = await Csg.findById(csgId);

      let isErrored = false;
      if (!foundCsg) {
        throw new Error("Csg not found");
      }

      foundCsg.isDone = true;

      await foundCsg.save();

      const popedCsg = await Csg.findById(csgId);
      const popedUser = await User.findById(currentUserId);

      !isErrored && res.status(200).send({ csg: popedCsg, user: popedUser });
    } catch (error) {
      res.status(500).send(error?.message);
    }
  };

  static csgById = async (req, res) => {
    const currentUserId = req?.user?._id;
    const csgId = req?.params?.id;
    try {
      const popedCsg = await Csg.findById(csgId);

      if (!popedCsg) {
        throw new Error("Csg not found");
      }

      const popedUser = await User.findById(currentUserId);

      res.status(200).send({ csg: popedCsg, user: popedUser });
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  static rating = async (req, res) => {
    const currentUserId = req?.user?._id;
    const { csgId, rating } = req?.body;
    try {
      const foundCsg = await Csg.findById(csgId);

      if (!foundCsg) {
        throw new Error("Csg not found");
      }

      // set current user is rate to true
      foundCsg?.rates?.forEach((el) => {
        if (el?.member?.toString() === currentUserId?.toString()) {
          el.isRate = true;
        }
      });

      await foundCsg.save();

      const popedCsg = await Csg.findById(csgId);
      const popedUser = await User.findById(currentUserId);

      res.status(200).send({ csg: foundCsg, user: popedUser });
    } catch (err) {
      res.status(500).send(err?.message);
    }
  };
}

module.exports = CsgMethods;
