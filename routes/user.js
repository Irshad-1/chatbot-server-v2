const express = require("express");
const { createUser, loginUser, getUser } = require("../handlers/user");
const userRouter = express.Router();

userRouter.post("/createuser", createUser);
userRouter.post("/login", loginUser);
/**
 * @swagger
 * /getuser:
 *   get:
 *     summary: Get user detail
 *     description: Retrieve user details
 *     responses:
 *       200:
 *         description: Successful operation
 */
userRouter.get("/getuser", getUser);

module.exports = { userRouter };
