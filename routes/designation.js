const express = require("express");
const designationRouter = express.Router();
const { addDesignation, getAllDesignations } = require("../handlers/designation");

designationRouter.post("/add-designation", addDesignation);
designationRouter.get("/get-all-designation", getAllDesignations);

module.exports = { designationRouter };
