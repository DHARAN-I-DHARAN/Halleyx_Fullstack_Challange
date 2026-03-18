const Workflow = require("../models/Workflow")
const Step = require("../models/Step");
const Rule = require("../models/Rule");
const Execution = require("../models/Execution");

exports.createWorkflow = async (req, res) => {
    try {
        const workflow = await Workflow.create(req.body);
        res.status(201).json(workflow);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getWorkflows = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const query = search ? { name: { $regex: search, $options: "i" } } : {};

        const workflows = await Workflow.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Workflow.countDocuments(query);

        res.json({ workflows, total, page: Number(page), limit: Number(limit) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getWorkflowById = async (req, res) => {
    try {
        const workflow = await Workflow.findById(req.params.id).populate("startStep");
        if (!workflow) {
            return res.status(404).json({ error: "Workflow not found" });
        }

        const steps = await Step.find({ workflow: workflow.id }).sort({ order: 1});
        const stepIds = steps.map((step) => step._id);
        const rules = await Rule.find({ step: {$in: stepIds } });

        res.json({ workflow, steps, rules });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    res.json(workflow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteWorkflow = async (req, res) => {
    try {
        const workflow = await Workflow.findById(req.params.id);

        if (!workflow) {
            return res.status(404).json({ error: "Workflow not found" });
        }

        const steps = await Step.find({ workflow: workflow._id });
        const stepIds = steps.map((step) => step._id);

        await Rule.deleteMany({ step: {$in: stepIds } });
        await Step.deleteMany({ workflow: workflow._id });
        await Execution.deleteMany({ workflow: workflow._id });
        await Workflow.findByIdAndDelete(req.params.id);

        res.json({ message: "Workflow and related data deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};