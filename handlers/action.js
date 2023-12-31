const { Action } = require("../database/action");
const { Question } = require("../database/question");

const addAction = async (req, res) => {
    try {
        const { actionName } = req.body;
        const status = req?.body?.status || true;
        await Action.create({
            actionName,
            status,
        });
        return res.status(201).send({ message: "Action added successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error || "Internal Server Error" });
    }
};

const getAllActions = async (req, res) => {
    try {
        const allActions = await Action.find();
        return res.send(allActions);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error || "Internal Server Error" });
    }
};

const fireAction = async (req, res) => {
    try {
        const action = await Action.findOne({ _id: req.body.actionId });
        const message = getActionMessage(action.actionName);
        if (req.body?.linkedQuestion) {
            const linkedQuestion = await Question.findOne({ _id: req.body.linkedQuestion });
            return res.status(200).send({ message, linkedQuestion });
        }
        else {
            return res.status(200).send({ message });
        }


    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error || "Internal Server Error" });
    }
}

const getActionMessage = (actionName) => {
    switch (actionName) {
        case "Create Ticket":
            return "A ticket has been created with ID : 141691 . Please do the follow up using this Id";
        case "Fetch all Leave":
            return "You are having 2 days of casual leave and 5 days of planned leave.";
        case "Apply for casual leave":
            let date = new Date().toUTCString().slice(5, 16);
            return `You have successfully applied for casual leave on ${date}`;
        case "Apply for planned leave":
            date = new Date().toUTCString().slice(5, 16);
            return `You have successfully applied for planned leave on ${date}`;
        default:
            return "Unknown action!";
    }
}

module.exports = { addAction, getAllActions, fireAction };
