const express = require("express");

const authController = require("../controllers/auth.controllers");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signinOTP);

// router.post("/signin", authController.signin);
router.post("/signin/verify", authController.verify);

router.post("/signup/otp", authController.generateOTPbeforeSignup);

module.exports = router;
