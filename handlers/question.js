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
        const { question, status, departmentId, answer, isAction, isSystemQuestion, linkedQuestion } = req.body;
        console.log("I am request body", req.body);
        const action = req?.body?.action || "";

        if (isSystemQuestion) {
            if (linkedQuestion !== "") {
                const newQuestion = await Question.create({
                    question,
                    status,
                    departmentId,
                    createdBy: user._id,
                    updatedBy: user._id,
                    isSystemQuestion,
                    action,
                    linkedQuestion
                });
            }
            else {
                const newQuestion = await Question.create({
                    question,
                    status,
                    departmentId,
                    createdBy: user._id,
                    updatedBy: user._id,
                    isSystemQuestion,
                    action,
                });
            }
            return res.status(201).send({ message: "Question/Answer added successfully" });
        }
        else {
            const newQuestion = await Question.create({
                question,
                status,
                departmentId,
                createdBy: user._id,
                updatedBy: user._id,
                isSystemQuestion
            });
            if (isAction) {
                if (linkedQuestion !== "")
                    await Answer.create({
                        answer,
                        questionId: newQuestion._id,
                        isAction,
                        action,
                        createdBy: user._id,
                        updatedBy: user._id,
                        linkedQuestion
                    });
                else
                    await Answer.create({
                        answer,
                        questionId: newQuestion._id,
                        isAction,
                        action,
                        createdBy: user._id,
                        updatedBy: user._id,
                    });
            }
            else {
                if (linkedQuestion !== "")
                    await Answer.create({
                        answer,
                        questionId: newQuestion._id,
                        isAction,
                        createdBy: user._id,
                        updatedBy: user._id,
                        linkedQuestion
                    });
                else
                    await Answer.create({
                        answer,
                        questionId: newQuestion._id,
                        isAction,
                        createdBy: user._id,
                        updatedBy: user._id,
                    });
            }
            return res.status(201).send({ message: "Question/Answer added successfully" });
        }


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

const getAllSystemQuestions = async (req, res) => {
    try {
        const sytemQuestions = await Question.find({
            isSystemQuestion: true
        });
        return res.send(sytemQuestions);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error || "Internal Server Error" });
    }
};
const getLinkedQuestionData = async (req, res) => {
    try {
        const linkedQuestion = await Question.findOne({ _id: req.body.questionId });
        return res.send(linkedQuestion);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error || "Internal Server Error" });
    }
};

module.exports = { feedQuestionAnswer, getAllQuestionAnswer, changeStatus, getAllSystemQuestions, getLinkedQuestionData };
