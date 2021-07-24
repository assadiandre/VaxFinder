const express = require("express");
const { Router } = express;
const asyncHandler = require("express-async-handler");
const router = Router();
const TO = "+19083562278";
const BODY = `Hello you've got a message`;
const { sendResult } = require("../controllers/smsControllers");

router.post("/", sendResult);

// server.get("/send", (req, res) => {
//   client.messages
//     .create({
//       body: BODY,
//       messagingServiceSid: process.env.MESSAGING_SERVICE_SID,
//       to: TO,
//       from: "+1 678 379 5422",
//     })
//     .then((message) => console.log(message.sid))
//     .done();
// });

module.exports = router;
