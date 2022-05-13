const axios = require("axios");
const { nowTime } = require("./nowTImeGen");

// var xhr = new XMLHttpRequest();
// xhr.open(
//   "GET",
//   "https://platform.clickatell.com/messages/http/send?apiKey=NDr1kXbQSquUgqMvwLgqRA==&to=201025209526&content=Test+message+text",
//   true
// );
// xhr.onreadystatechange = function () {
//   if (xhr.readyState == 4 && xhr.status == 200) {
//     console.log("success");
//   }
// };
// xhr.send();

const smsAPI = axios.create({
  baseURL: "https://platform.clickatell.com/messages/http/",
});

const sendTime = nowTime;

module.exports.SEND_SMS = async (key, to, msg) => {
  try {
    console.log("📩 sendSMS", to, msg, sendTime);
    const resp = await smsAPI.get(
      `send?apiKey=NDr1kXbQSquUgqMvwLgqRA==&to=+${
        key + to
      }&content=QattaApp+code:+${msg}\nsent at+${sendTime}`
    );

    // console.log("📩 API", resp?.data?.messages[0]);

    console.log("📩 API to: ", key + to);
    console.log(
      "📩 API Done?",
      resp?.data?.messages[0]?.accepted ? "✅" : "❌"
    );
    console.log("📩 API error", resp?.data?.messages[0]?.error);
    console.log(
      "📩 API errorDescription",
      resp?.data?.messages[0]?.errorDescription
    );

    return resp.data;
  } catch (err) {
    console.log(err.message);
  }
};
