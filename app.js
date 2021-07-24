require("dotenv").config();
const express = require("express");
const server = express();
const http = require("http");

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.get("/", (req, res) => res.send("<h1>Hello</h1>"));
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
