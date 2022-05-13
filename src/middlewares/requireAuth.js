const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // authorization === 'Bearer laksjdflaksdjasdfklj

    //

    if (!authorization) {
      throw new Error("can't find authorization header");
    }

    const token = authorization.replace("Bearer ", "");

    //

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    // const encoded = jwt.verify(token, process.env.JWT_SECRET);

    //
    //

    const user = await User.findOne({
      _id: userId,
      token,
    });

    //

    if (!user) {
      throw new Error("ReqAuth/user not found");
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    //
    res.status(401).send({
      error: err.message,
      message: "ReqAuth/user not found",
    });
  }
};

module.exports = auth;
