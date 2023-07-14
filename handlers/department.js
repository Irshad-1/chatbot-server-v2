const { Department } = require("../database/department");

const addDepartment = async (req, res) => {
    try {
        const { departmentName } = req.body;
        const status = req?.body?.status || true;
        await Department.create({
            departmentName,
            status,
        });
        return res.status(201).send({ message: "Department added successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error || "Internal Server Error" });
    }
};

const getAllDepartments = async (req, res) => {
    try {
        const allDepartments = await Department.find();
        return res.send(allDepartments);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error || "Internal Server Error" });
    }
};

module.exports = { addDepartment, getAllDepartments };
