const jwt = require("jsonwebtoken");
const { User } = require("../database/user");
const bcrypt = require("bcrypt");
const secret = process.env.SECRET;

// create a new user
const createUser = async (req, res) => {
    try {
        let lastName = req?.body?.lastName || "";
        const { firstName, email, employeeId, designationId, departmentId, password } = req.body;
        const check = await User.findOne({ email });
        if (check) {
            return res.status(400).json({
                message: "User already exists",
            });
        } else {
            let newPassword = await bcrypt.hash(password, 8);

            const newUser = await User.create({
                firstName,
                lastName,
                email,
                employeeId,
                designationId,
                departmentId,
                password: newPassword,
            });

            let response = newUser.toJSON();
            delete response.password;
            return res.status(201).send(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error || "Internal Server Error" });
    }
};

// login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).populate("password");
        if (!user) {
            return res.status(400).send({
                message: "User does not exist",
            });
        } else {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                let token = jwt.sign({ _id: user._id }, secret);
                return res.status(200).send({ token: token });
            } else {
                return res.status(400).send({ message: "Invalid password" });
            }
        }
    } catch (error) {
        return res.status(500).send({ message: error || "Internal Server Error" });
    }
};

// get user
const getUser = async (req, res) => {
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
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ message: error || "Internal Server Error" });
    }
};
module.exports = {
    createUser,
    loginUser,
    getUser,
};
