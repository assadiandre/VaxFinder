require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const TO = "+19083562278";
const BODY = `Hello you've got a message`;

client.messages
  .create({
    body: BODY,
    messagingServiceSid: process.env.MESSAGING_SERVICE_SID,
    to: TO,
    from: "+1 631 657 2237",
  })
  .then((message) => console.log(message.sid))
  .done();
