const jwt = require("jsonwebtoken");
const { Question } = require("../database/question");
const { User } = require("../database/user");
const { Answer } = require("../database/answer");
const secret = process.env.SECRET;

const feedQuestionAnswer = async (req, res) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).send({ message: "No token provided" });
        }
        const decoded = jwt.verify(token, secret);
        const user = await User.findOne({ _id: decoded._id });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const { question, status, departmentId, answer, isAction } = req.body;
        const actionType = req?.body?.actionType || "";
        const newQuestion = await Question.create({
            question,
            status,
            departmentId,
            createdBy: user._id,
            updatedBy: user._id,
        });
        await Answer.create({
            answer,
            questionId: newQuestion._id,
            isAction,
            actionType,
            createdBy: user._id,
            updatedBy: user._id,
        });
        return res.status(201).send({ message: "Question/Answer added successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error || "Internal Server Error" });
    }
};
const getAllQuestionAnswer = async (req, res) => {
    try {
        const allQuestionAnswers = await Answer.find().populate({
            path: "questionId",
            populate: { path: "departmentId" },
        });
        return res.send(allQuestionAnswers);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error || "Internal Server Error" });
    }
};

const changeStatus = async (req, res) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).send({ message: "No token provided" });
        }
        const decoded = jwt.verify(token, secret);
        const user = await User.findOne({ _id: decoded._id });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        await Question.findOneAndUpdate({ _id: req.body.id }, [
            { $set: { status: { $eq: [false, "$status"] }, updatedBy: user._id } },
        ]);
        return res.status(201).send({ message: "Status updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error || "Internal Server Error" });
    }
};
module.exports = { feedQuestionAnswer, getAllQuestionAnswer, changeStatus };
