const { Configuration, OpenAIApi } = require("openai");
const { User } = require("../database/user");
const jwt = require("jsonwebtoken");
const { Question } = require("../database/question");
const { Answer } = require("../database/answer");
const secret = process.env.SECRET;
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const sendMessage = async (req, res) => {
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
        if (!configuration.apiKey) {
            res.status(500).json({
                error: {
                    message: "OpenAI API key not configured, please follow instructions in README.md",
                },
            });
            return;
        }

        const message = req.body.message || "";
        if (message.trim().length === 0) {
            res.status(400).json({
                error: {
                    message: "Please enter a valid message",
                },
            });
            return;
        }
        const allQuestionAnswers = await Answer.find().populate({
            path: "questionId",
            populate: { path: "departmentId" },
        });
        console.log(allQuestionAnswers);
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: generatePrompt(message, allQuestionAnswers),
            temperature: 0.1,
            max_tokens: 2000,
        });
        if (completion.data.choices[0].text.trim() === "Unknown") {
            res.status(200).json({ result: "Please ask a relevant question." });
        } else {
            // const chatResponse = completion.data.choices[0].text;
            // const indexOfOpeningBracket = chatResponse.indexOf("(");
            // const indexOfClosingBracket = chatResponse.indexOf(")");
            // const category = chatResponse.substring(indexOfOpeningBracket + 1, indexOfClosingBracket).trim();
            // console.log(completion.data.choices[0].text);
            // if (category === "Accounts/Finance" || category === "HR" || category === "Systems") {
            //     const indexOfSecondOpeningBracket = chatResponse.indexOf("(", indexOfOpeningBracket + 1);
            //     const indexOfSecondClosingBracket = chatResponse.indexOf(")", indexOfClosingBracket + 1);
            //     const isTicketCreationRequired = chatResponse
            //         .substring(indexOfSecondOpeningBracket + 1, indexOfSecondClosingBracket)
            //         .trim();
            //     if (isTicketCreationRequired == "true")
            //         await Chat.create({ category, question: message, userId: decoded._id });
            // }
            console.log("I am answer reference", completion.data.choices[0].text);
            let indexOf = completion.data.choices[0].text.indexOf(":");
            console.log("indexOf", indexOf);
            if (indexOf != -1) {
                const answerData = await Answer.findOne({ _id: completion.data.choices[0].text.split(":")[1] }).populate({
                    path: "linkedQuestion",
                    populate: { path: "linkedQuestion" },
                });
                res.status(200).json({
                    result: answerData?.answer || "Please ask a relevant question.",
                    linkedQuestion: answerData?.linkedQuestion
                });
            }
            else {
                const answerData = await Answer.findOne({ _id: completion.data.choices[0].text }).populate({
                    path: "linkedQuestion",
                    populate: { path: "linkedQuestion" },
                });
                res.status(200).json({
                    result: answerData?.answer || "Please ask a relevant question.",
                    linkedQuestion: answerData?.linkedQuestion
                });
            }

        }
    } catch (error) {
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: "An error occurred during your request.",
                },
            });
        }
    }
};

function generatePrompt(message, allQuestionAnswers) {
    let initialMessage =
        "I am a chat bot of a company named Indus Net Technologies Private Limited. I acts as a helpdesk for common FAQ , griveance redressal , query of employees relating to company's policies and rules and regulation and my responses are based on the below conversations only .If some one asks questions which is not related to the below conversation , then I will respond as 'Unknown'.Please respond with given replies only, do not add any sentence by your own .";
    let str = "";
    str = str + initialMessage;
    for (let i = 0; i < allQuestionAnswers.length; i++) {
        if (allQuestionAnswers[i]?.questionId?.status) {
            const message = `Employee:${allQuestionAnswers[i]?.questionId?.question} \n ${allQuestionAnswers[i]?.questionId?.departmentId?.departmentName}:${allQuestionAnswers[i]?._id} \n`;
            str = str + message;
        }
    }
    console.log(str);
    str = str + `Employee:${message} \n chatbot:`;
    // console.log("I am str", str);
    return str;
    return ` I am a chat bot of a company named Indus Net Technologies Private Limited. I acts as a helpdesk for common FAQ , griveance redressal , query of employees relating to company's policies and rules and regulation and my responses are based on the below conversations only .  
    Currently I am answering queries related to HR,accounts/Finance and systems department only . My replies also includes suffix of the department name from which the queries are getting answered.For Example:If the queries is answered by "Accounts/Finance department", then add "(Accounts/Finance)" in the end of the reply or if the queries are getting answered by "HR"  then add "(HR)" or if the queries are getting answered by "Systems"  then add "(Systems)" 
    and also add one more suffix if the below chat reply from the department end with the word "true" , then only add (true) as suffix otherwise add (false) as suffix in all the responses . So essentially you are adding two suffixes with the brackets. Suffixes must be in brackets.
    If some one asks questions which is not related to the below conversation , then I will respond as "Unknown" and there would be no second suffix in that case.

  Employee:How can I update my bank account information for direct deposit?
  Accounts/Finance department:If you need to update your bank account information for direct deposit, please reach out to the accounts and finance department. They will provide you with the necessary forms or instructions to make the required changes and ensure that your payments are directed to the updated bank account 
  Employee:Whom should i reach for updating my bank account?
  Accounts/Finance department:If you need to update your bank account information for direct deposit, please reach out to the accounts and finance helpdesk. They will provide you with the necessary forms or instructions to make the required changes and ensure that your payments are directed to the updated bank account 
  Employee:Do you know about , how can someone update their bank account?
  Accounts/Finance department:If you need to update your bank account information for direct deposit, please reach out to the accounts and finance helpdesk. They will provide you with the necessary forms or instructions to make the required changes and ensure that your payments are directed to the updated bank account 
  Employee: How do I request time off?
  HR department: To request time off, please refer to our company's leave policy.
  You can submit a formal request through our designated system, or contact your immediate supervisor or the HR department for further guidance.
  Employee: What is the process of taking leave ?
  HR department: To request time off, please refer to our company's leave policy.
  You can submit a formal request through our designated system, or contact your immediate supervisor or the HR department for further guidance.
  Employee: I want to take leave, what is the process for that
  HR department: To request time off, please refer to our company's leave policy.
  You can submit a formal request through our designated system, or contact your immediate supervisor or the HR department for further guidance.
  Employee: I want to update my hardware of my PC.
  Systems department:Please drop a mail to the systems team , along with the approval of your manager .We will address your issue .
  Enployee: I want a wireless mouse/monitor/keyboard/cpu .
  Systems department:Please drop a mail to the systems team , along with the approval of your manager .We will address your issue .
  Employee: I am facing issues with my headphone/monitor/keyboard/CPU/mouse(any hardware peripherals). 
  Systems department:I am creating a ticket in the INTHUB helpdesk portal . We will address your issue, from there and you can also follow-up using the same ticket ID. true
  Employee: ${message}
 chatbot:`;
}
module.exports = { sendMessage };
