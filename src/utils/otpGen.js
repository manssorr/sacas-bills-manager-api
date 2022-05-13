const otpGenerator = require("otp-generator");

const OTP_CONFIG = {
  upperCaseAlphabets: false,
  specialChars: false,
};
module.exports.generateOTPKG = () => {
  const OTP = otpGenerator.generate(4, OTP_CONFIG);
  return OTP;
};

// Hand-made OTP generator
module.exports.generateOTP = () => {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};
