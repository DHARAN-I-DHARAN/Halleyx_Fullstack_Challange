const mongoose = require("mongoose");

const ExecutionLogSchema = new mongoose.Schema(
    {
        step: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Step",
            default: null,
        },
        stepName: {
            type: String,
            default: "",
        },
        stepType: {
            type: String,
            default: "",
        },
        evaluatedRules: [
            {
                condition: String,
                result: Boolean,
                nextStep: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Step",
                    default: null,
                },
            },
        ],
        selectedNextStep: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Step",
            default: null,
        },
        status: {
            type: String,
            enum: [
                "pending", "completed", "failed", "skipped"
            ],
            default: "pending",
        },
        message: {
            type: String,
            default: "",
        },
        startedAt: Date,
        endedAt: Date,
    },
    {_id: false}
);

const ExecutionSchema = new mongoose.Schema(
    {
        workflow: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workflow",
            required: true,
        },
        workflowVersion: {
            type: Number,
            default: 1,
        },
        status: {
            type: String,
            enum: ["pending","in_progress","completed","failed","canceled"],
            default: "pending",
        },
        inputData: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        currentStep: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Step",
            default: null,
        },
        logs: {
            type: [ExecutionLogSchema],
            default: [],
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        endedAt: {
            type:Date,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Execution", ExecutionSchema);