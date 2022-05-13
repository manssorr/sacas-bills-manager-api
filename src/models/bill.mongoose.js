const mongoose = require("mongoose");
const User = mongoose.model("User");
const Schema = mongoose.Schema;

const billSchema = new Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      autopopulate: { maxDepth: 1 },
    },
    allMembers: [
      {
        member: {
          type: Schema.Types.ObjectId,
          ref: "User",
          autopopulate: { maxDepth: 1 },
        },
        isPaid: {
          type: Boolean,
          default: false,
        },
      },
    ],
    totalAmount: {
      type: Number,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    needToBePaid: {
      type: Number,
      default: 0,
    },
    singlePayment: Number,
    kind: {
      type: String,
      default: "equally",
    },
    rates: [
      {
        member: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        isRate: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// This is pre save that done all defualt values. like avatar, type, paid
billSchema.pre("save", function (next) {
  const bill = this;

  if (bill.isNew) {
    const { allMembers, totalAmount } = bill;

    const numOfMembersWithoutOwner = allMembers?.length;

    // Because total amount of bill which owner pay, he was included in it, but he will not pay with the members any way, so we need to calc the total value without him.

    const numOfMembersWithOwner = numOfMembersWithoutOwner + 1;

    const singlePayment = (totalAmount / numOfMembersWithOwner)?.toFixed();

    // Set the totalBalance with out the owner.
    bill.needToBePaid = numOfMembersWithoutOwner * singlePayment;
    bill.singlePayment = singlePayment;

    // Generate rates
    const rates = allMembers?.map((el) => {
      return {
        member: el?.member,
        isRate: false,
      };
    });

    rates?.push({
      member: bill?.owner,
      isRate: false,
    });

    bill.rates = rates;
  }

  next();
});

billSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Bill", billSchema);
