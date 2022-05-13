const mongoose = require("mongoose");
const User = mongoose.model("User");
const Schema = mongoose.Schema;

const csgSchema = new Schema(
  {
    name: {
      type: String,
    },
    avatar: {
      type: String,
      default: getRandomColor(),
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    allMembers: [
      {
        member: {
          type: Schema.Types.ObjectId,
          ref: "User",
          autopopulate: { maxDepth: 1 },
        },
        order: Number,
      },
    ],
    cycles: [
      {
        NO: Number,
        payCount: {
          type: Number,
          default: 0,
        },
        receiver: {
          type: Schema.Types.ObjectId,
          ref: "User",
          autopopulate: { maxDepth: 1 },
        },
        isLast: Boolean,
        isDone: {
          type: Boolean,
          default: false,
        },
        members: [
          {
            member: {
              type: Schema.Types.ObjectId,
              ref: "User",
              autopopulate: { maxDepth: 2 },
            },
            order: Number,
            isPaid: {
              type: Boolean,
              default: false,
            },
            isCycleReceiver: Boolean,
          },
        ],
      },
    ],
    totalBalance: {
      type: Number,
      // required: true,
    },
    monthlyShare: {
      type: Number,
      // required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
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

csgSchema.pre("save", function (next) {
  const csg = this;

  if (csg.isNew) {
    // Set the total balance
    csg.totalBalance = csg?.allMembers?.length * csg?.monthlyShare;

    // Set the cycles
    csg?.allMembers?.forEach(async (el, index, allMembers) => {
      const genNO = index + 1;
      const genReceiver = allMembers?.find((el) => el?.order === genNO)?.member;

      //
      //
      //
      //
      //

      const genMembersFixed = allMembers?.map((mem) => {
        return {
          member: mem?.member,
          isPaid: false,
          isCycleReceiver: mem?.order === genNO,
          order: mem?.order,
        };
      });

      const genMembersOrdered = genMembersFixed?.sort(
        (a, b) => a?.order - b?.order
      );

      csg?.cycles?.push({
        NO: genNO,
        receiver: genReceiver,
        members: genMembersOrdered,
        isLast: genNO === allMembers?.length,
      });

      csg?.rates?.push({
        member: el?.member,
        isRate: false,
      });
    });
  }

  next();
});

csgSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Csg", csgSchema);
