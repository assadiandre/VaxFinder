require("dotenv").config();
const express = require("express");
const server = express();
const http = require("http");
const cors = require("cors");
const fs = require("fs");
var exphbs = require("express-handlebars");

server.use(cors());
server.use((req, res, next) => {
  console.log({ url: req.url });
  next();
});
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "main.hbs",
  })
);
server.set("view engine", "hbs");

server.get("/", (req, res) => res.send("<h1>Hello</h1>"));
server.get("/map", (req, res) => {
  // X : Longitude
  // Y : Latitude
  const users = JSON.parse(
    fs.readFileSync("./users.json", { encoding: "utf-8" })
  );
  const user = users
    .reverse()
    .find((u) => "+" + req.query.user.replace(/\s/gm, "") === u.user);
  res.render("map", {
    viewX: user.viewX,
    viewY: user.viewY,
    startX: user.startX,
    startY: user.startY,
    endX: user.endX,
    endY: user.endY,
    // viewX: -118.24532,
    // viewY: 34.05398,
    // startX: -118.20266214782522,
    // startY: 34.0661392140904,
    // endX: -118.19905725890919,
    // endY: 34.039543112981754,
  });
});
server.use("/sms", require("./routes/smsRoutes"));
server.use((err, req, res, next) => {
  console.log(err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

server.listen(3000, () => console.log(`Server running on port ${3000}`));
