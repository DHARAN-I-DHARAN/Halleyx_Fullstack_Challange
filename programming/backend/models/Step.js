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
            required: true,
            trim: true,
        },
        stepType: {
            type: String,
            enum: ["task","approval","notification","end"],
            required: true,
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

StepSchema.index({ workflow: 1, order: 1 });
module.exports = mongoose.model("Step",StepSchema);