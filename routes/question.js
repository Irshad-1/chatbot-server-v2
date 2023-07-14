const express = require("express");
const questionRouter = express.Router();
const { feedQuestionAnswer, getAllQuestionAnswer, changeStatus } = require("../handlers/question");

questionRouter.post("/add-question-answer", feedQuestionAnswer);
questionRouter.get("/get-all-question", getAllQuestionAnswer);
questionRouter.post("/change-status", changeStatus);

module.exports = { questionRouter };
