const express = require("express");
const actionRouter = express.Router();
const { addAction, getAllActions, fireAction } = require("../handlers/action");

actionRouter.post("/add-action", addAction);
actionRouter.get("/get-all-action", getAllActions);
actionRouter.post("/fire-action", fireAction);

module.exports = { actionRouter };
