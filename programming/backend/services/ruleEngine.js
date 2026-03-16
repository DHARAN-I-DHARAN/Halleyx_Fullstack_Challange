const Rule = require("../models/Rule");

const evaluateCondition = (condition, inputData) => {
    try {
        if (!condition || condition.trim() === "") {
            return false;
        }

        if (condition.trim().toUpperCase() === "DEFAULT") {
            return true;
        }

        const keys = Object.keys(inputData || {});
        const values = Object.values(inputData || {});

        const fn = new Function(...keys, `return (${condition});`);
        return Boolean(fn(...values));
    } catch (error) {
        return false;
    }
};

const evaluateRulesForStep = async (stepId, inputData) => {
    const rules = await Rule.find({ step: stepId }).sort({ priority: 1});

    const evaluatedRules = [];
    let selectedRule = null;

    for (const rule of rules) {
        const result = evaluateCondition(rule.condition, inputData);

        evaluatedRules.push({
            ruleId: rule._id,
            condition: rule.condition,
            result,
            nextStep: rule.nextStep,
            priority: rule.priority,
        });

        if (result && !selectedRule) {
            selectedRule = rule;
            break;
        }
    }

    return {
        selectedRule,
        evaluatedRules,
    };
};

module.exports = {
    evaluateCondition,
    evaluateRulesForStep,
};