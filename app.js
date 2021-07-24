require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const express = require("express");
const server = express();
const bodyParser = require("body-parser");

const TO = "+19083562278";
const BODY = `Hello you've got a message`;

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.get("/", (req, res) => res.send("<h1>Hello</h1>"));
server.get("/send", (req, res) => {
  client.messages
    .create({
      body: BODY,
      messagingServiceSid: process.env.MESSAGING_SERVICE_SID,
      to: TO,
      from: "+1 678 379 5422",
    })
    .then((message) => console.log(message.sid))
    .done();
});

server.post("/sms", (req, res) => {
  // Start our TwiML response.
  console.log(req.body.Body); // <- This is the message sent from a user
  const smsReply = req.body.Body;
  const twiml = new MessagingResponse();
  // Add a text message.
  const msg = twiml.message(`You typed: ${smsReply}`);
  console.log(msg);
  // Add a picture message.
  //   msg.media("https://demo.twilio.com/owl.png");

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

server.listen(3000);
