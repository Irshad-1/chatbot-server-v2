const { Answer } = require("../database/answer");

const getAllAnswers = async (req, res) => {
  try {
    const allAnswers = await Answer.find();
    return res.send(allAnswers);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error || "Internal Server Error" });
  }
};

module.exports = {
  getAllAnswers
}