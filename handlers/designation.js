const { Designation } = require("../database/designation");

const addDesignation = async (req, res) => {
    try {
        const { designationName } = req.body;
        await Designation.create({
            designationName,
        });
        return res.status(201).send({ message: "Designation added successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error || "Internal Server Error" });
    }
};

const getAllDesignations = async (req, res) => {
    try {
        const allDesignations = await Designation.find();
        return res.send(allDesignations);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error || "Internal Server Error" });
    }
};

module.exports = { addDesignation, getAllDesignations };
