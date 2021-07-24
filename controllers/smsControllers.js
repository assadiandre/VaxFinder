const asyncHandler = require("express-async-handler");

const MessagingResponse = require("twilio").twiml.MessagingResponse;

const { findLocation } = require("../lib/findLocation");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

exports.sendResult = asyncHandler(async (req, res) => {
  console.log(req.body.Body);
  // Start our TwiML response.
  const recMsg = req.body.Body;
  const twiml = new MessagingResponse();
  // Add a text message.
  const info = await findLocation(recMsg);
  const msg = twiml.message(
    `Location you asked : ${info.address}. \n X : ${info.location.x}.\n Y: ${info.location.y}`
  );
  //   console.log(msg);
  // Add a picture message.
  //   msg.media("https://demo.twilio.com/owl.png");
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});
