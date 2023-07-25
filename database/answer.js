const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
    {
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
        isAction: {
            type: Boolean,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        linkedQuestion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
        },
        action: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Action",
        }
    },
    {
        timestamps: true,
    }
);

const Answer = mongoose.model("Answer", answerSchema);

module.exports = { Answer };
