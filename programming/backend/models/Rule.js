const mongoose = require("mongoose");

const RuleSchema = new mongoose.Schema(
    {
        step: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Step",
            required: true,
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

RuleSchema.index({ step: 1, priority: 1 });
module.exports = mongoose.model("Rule", RuleSchema);