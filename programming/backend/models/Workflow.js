const mongoose = require("mongoose");

const WorkflowSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        version: {
            type: Number,
            default: 1,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        inputSchema: {
            type: Object,
            default: {},
        },
        startStep: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Step",
            default: null,
        },
    },
    {timestamps: true }
);

WorkflowSchema.index({ name: "text" });      
WorkflowSchema.index({ isActive: 1 });
module.exports = mongoose.model("Workflow",WorkflowSchema);