const { Action } = require("../database/action");

const addAction = async (req, res) => {
    try {
        const { actionName, actionLabel } = req.body;
        const status = req?.body?.status || true;
        await Action.create({
            actionName,
            actionLabel,
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

module.exports = { addAction, getAllActions };
