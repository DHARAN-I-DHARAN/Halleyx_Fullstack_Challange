const Step = require("../models/Step");
const Rule = require("../models/Rule");
const { evaluateRulesForStep } = require("../services/ruleEngine");


exports.createRule = async (req, res) => {
    try {
        const {stepId} = req.params;

        const step = await Step.findById(stepId);
        if (!step) {
            return res.status(404).json({ error: "Step not found" });
        }

        const rule = await Rule.create({
            ...req.body,
            step: stepId,
        });

        res.status(201).json(rule);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getRulesByStep = async (req, res) => {
    try {
        const {stepId} = req.params;
        const rules = await Rule.find({ step: stepId }).sort({ priority: 1});
        res.json(rules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRule = async (req, res) => {
    try {
        const rule = await Rule.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!rule) {
            return res.status(404).json({ error: "Rule not found" });
        }
        res.json(rule);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteRule = async (req, res) => {
    try {
        const rule = await Rule.findByIdAndDelete(req.params.id);

        if (!rule) {
            return res.status(404).json({ error: "Rule not found" });
        }
        res.json({ message: "Rule deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.testRuleEngine = async (req, res) => {
    try {
        const { stepId } = req.params;
        const inputData = req.body;

        const step = await Step.findById(stepId);
        if (!step) {
            return res.status(404).json({ error: "Step not found" });
        }

        const result = await evaluateRulesForStep(stepId, inputData);

        res.json({
            message: "Rule evaluation completed",
            stepId,
            inputData,
            selectedRule: result.selectedRule,
            evaluatedRules: result.evaluatedRules,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};