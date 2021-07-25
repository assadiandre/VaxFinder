const asyncHandler = require("express-async-handler");
const fs = require("fs");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

const { findLocation } = require("../lib/findLocation");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

exports.sendResult = asyncHandler(async (req, res) => {
  console.log(req.body.Body);
  if (req.body.Body.toLowerCase() === "start") {
    const twiml = new MessagingResponse();
    const msg = twiml.message(
      `Welcome to VaxFinder! Please enter a street address, city or zip code and we’ll find you a vaccination clinic or hospital nearby.      `
    );
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
    return;
  }
  // Start our TwiML response.
  const recMsg = req.body.Body;
  const twiml = new MessagingResponse();
  // Add a text message.
  const info = await findLocation(recMsg, +" " + req.body.FromState);
  const users = JSON.parse(
    fs.readFileSync("./users.json", { encoding: "utf-8" })
  );
  users.push({
    user: req.body.From,
    viewX: Number(info.location.x.toFixed(4)),
    viewY: Number(info.location.y.toFixed(4)),
    startX: info.location.x,
    startY: info.location.y,
    endX: -117.206415,
    endY: 34.039035,
  });
  fs.writeFileSync("./users.json", JSON.stringify(users));
  const msg = twiml.message(
    `Awesome! We found one location matching your search, ${"Quest Diagnostics"}. 
    It is 10 minutes away. ${"Quest Diagnostics"} is open from ${"7:45a.m."} to ${"9:00p.m."}. 
    For more information, you can visit your local hospital department website.
    
    Here's a map with the direction: : ${process.env.HOST_URI}/map?user=${
      req.body.From
    }
    `
  );
  //   console.log(msg);
  // Add a picture message.
  //   msg.media("https://demo.twilio.com/owl.png");
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});
