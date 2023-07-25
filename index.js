require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDatabase = require("./database");
const { userRouter } = require("./routes/user");
const { questionRouter } = require("./routes/question");
const { departmentRouter } = require("./routes/department");
const { designationRouter } = require("./routes/designation");
const { actionRouter } = require("./routes/action");
const chatRouter = require("./routes/chat");
const { answerRouter } = require("./routes/answer");

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());
app.use(cors());
app.use(logger);
app.use(actionRouter);
app.use(questionRouter);
app.use(userRouter);
app.use(departmentRouter);
app.use(designationRouter);
app.use(chatRouter);
app.use(answerRouter);
require("./swagger")(app);

function logger(req, res, next) {
    console.info(new Date(), req.method, req.path);
    next();
}
connectDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});
