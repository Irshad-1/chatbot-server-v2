const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
        },
        isSystemQuestion: {
            type: Boolean,
            required: true,
        },
        status: {
            type: Boolean,
            required: true,
        },
        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
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
        action: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Action",
        },
        linkedQuestion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
        },
    },
    {
        timestamps: true,
    }
);
const Question = mongoose.model("Question", questionSchema);

module.exports = { Question };
