const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema(
    {
        actionName: {
            type: String,
            required: true,
        },
        actionLabel: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Action = mongoose.model("Action", actionSchema);

module.exports = { Action };
