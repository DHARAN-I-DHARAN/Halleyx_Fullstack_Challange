const Workflow = require("../models/Workflow");
const Execution = require("../models/Execution");
const { runExecution } = require("../services/executionEngine");

exports.startExecution = async (req, res) => {
    try {
        const { workflowId } = req.params;
        const inputData = req.body;

        const workflow = await Workflow.findById(workflowId);
        if (!workflow) {
            return res.status(404).json({ error: "Workflow not found "});
        }

        const execution = await Execution.create({
            workflow: workflow._id,
            workflowVersion: workflow.version,
            status: "pending",
            inputData,
            currentStep: workflow.startStep || null,
            logs: [],
            startedAt: new Date(),
        });

        const finalExecution = await runExecution(execution._id);

        res.status(201).json(finalExecution);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getExecutionById = async (req, res) => {
    try {
        const execution = await Execution.findById(req.params.id)
            .populate("workflow")
            .populate("currentStep")
            .populate("logs.step")
            .populate("logs.selectedNextStep");

            if (!execution) {
                return res.status(404).json({ error: "Execution not Found" });
            }

            res.json(execution);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllExecutions = async (req, res) => {
    try {
        const executions = await Execution.find()
            .populate("workflow")
            .sort({ createdAt: -1 });

            res.json(executions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.cancelExecution = async (req, res) => {
    try {
        const execution = await Execution.findById(req.params.id);

        if (!execution) {
            return res.status(404).json({ error: "Execution not found" });
        }

        if (["completed","failed","canceled"].includes(execution.status)) {
            return res.status(400).json({
                error: `Execution cannot be canceled because it is already ${execution.status}`,
            });
        }

        execution.status = "canceled";
        execution.endedAt = new Date();
        execution.logs.push({
            step: execution.currentStep || null,
            stepName: "",
            stepType: "",
            evaluatedRules: [],
            status: "failed",
            message: "Execution cancelled manually",
            startedAt: new Date(),
            endedAt: new Date(),
        });

        await execution.save();
        res.json(execution);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.retryExecution = async (req, res) => {
    try {
        const oldExecution = await Execution.findById(req.params.id);

        if (!oldExecution) {
            return res.status(404).json({ error: "Execution not found" });
        }

        const workflow = await Workflow.findById(oldExecution.workflow);
        if (!workflow) {
            return res.status(404).json({ error: "Workflow not found" });
        }

        const newExecution = await Execution.create({
            workflow: workflow._id,
            workflowVersion: workflow.version,
            status: "pending",
            inputData: oldExecution.inputData,
            currentStep: workflow.startStep || null,
            logs: [],
            startedAt: new Date(),
        });

        const finalExecution = await runExecution(newExecution._id);

        res.status(201).json(finalExecution);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
