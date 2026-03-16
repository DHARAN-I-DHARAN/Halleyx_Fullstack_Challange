const mongoose = require("mongoose");

const RuleSchema = new mongoose.Schema(
    {
        step: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Step",
            requried: true,
        },
        condition: {
            type: String,
            required: true,
            trim: true,
        },
        nextStep: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Step",
            default: null,
        },
        priority: {
            type: Number,
            default: 1,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Rule", RuleSchema);