const express = require("express");
const questionRouter = express.Router();
const { feedQuestionAnswer, getAllQuestionAnswer, changeStatus, getAllSystemQuestions, getLinkedQuestionData } = require("../handlers/question");

questionRouter.post("/add-question-answer", feedQuestionAnswer);
questionRouter.get("/get-all-question", getAllQuestionAnswer);
questionRouter.post("/change-status", changeStatus);
questionRouter.get("/get-all-system-question", getAllSystemQuestions);
questionRouter.post("/get-linked-question", getLinkedQuestionData);

module.exports = { questionRouter };
