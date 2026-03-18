const Rule = require("../models/Rule");
const { Parser } = require("expr-eval");

const evaluateCondition = (condition, inputData) => {
    if (condition === "DEFAULT") return true;
    try {
        const func = new Function(
        ...Object.keys(inputData),
        `return ${condition}`
        );

        return func(...Object.values(inputData));
    } catch (err) {
        console.error("Condition error:", condition, err);
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
        }
        
    }
    return {
        selectedRule,
        evaluatedRules,};
};


module.exports = {
    evaluateCondition,
    evaluateRulesForStep,
};