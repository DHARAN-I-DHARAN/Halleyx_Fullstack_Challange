const mongoose = require("mongoose");

const StepSchema = new mongoose.Schema(
    {
        workflow: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workflow",
            required: true,
        },
        name: {
            type: String,
            requried: true,
            trim: true,
        },
        stepType: {
            type: String,
            enum: ["task","approval","notification"],
            requried: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        metadata: {
            type: Object,
            default: {},
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Step",StepSchema);