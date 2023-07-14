const express = require("express");
const { sendMessage, fetchAllTickets } = require("../handlers/chat");
const chatRouter = express.Router();

chatRouter.post("/send-message", sendMessage);

module.exports = chatRouter;
