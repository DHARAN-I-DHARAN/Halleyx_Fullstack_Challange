const Workflow = require("../models/Workflow");
const Step = require("../models/Step");
const Rule = require("../models/Rule");

exports.createStep = async (req, res) => {
    try {
        const { workflowId } = req.params;

        const workflow = await Workflow.findById(workflowId);
        if (!workflow) {
            return res.status(404).json({ error: "Workflow not found" });
        }

        const step = await Step.create({
            ...req.body,
            workflow: workflowId,
        });

        res.status(201).json(step);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getStepsByWorkflow = async (req, res) => {
    try {
        const { workflowId } = req.params;
        const steps = await Step.find({ workflow: workflowId }).sort({ order: 1});
        res.json(steps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStep = async (req, res) => {
    try {
        const step = await Step.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!step) {
            return res.status(404).json({ error: "Step not found" });
        }

        res.json(step);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteStep = async (req, res) => {
    try {
        const step = await Step.findById(req.params.id);

        if (!step) {
            return res.status(404).json({ error: "Step not found" });
        }

        await Rule.deleteMany({ step: step._id });
        await Step.findByIdAndDelete(req.params.id);

        res.json({ message: "Step and related rules deleted sucessfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};