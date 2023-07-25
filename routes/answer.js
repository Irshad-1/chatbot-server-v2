const express = require("express");
const answerRouter = express.Router();
const { getAllAnswers, } = require("../handlers/answer");


answerRouter.get("/get-all-answer", getAllAnswers);

module.exports = { answerRouter };
