const express = require("express");
const departmentRouter = express.Router();
const { addDepartment, getAllDepartments } = require("../handlers/department");

departmentRouter.post("/add-department", addDepartment);
departmentRouter.get("/get-all-department", getAllDepartments);

module.exports = { departmentRouter };
