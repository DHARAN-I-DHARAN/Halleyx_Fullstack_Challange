const Workflow = require("../models/Workflow");
const Step = require("../models/Step");
const Execution = require("../models/Execution");
const { evaluateRulesForStep } = require("./ruleEngine");

const buildLogEntry = ({
    step,
    evaluatedRules = [],
    selectedRule = null,
    status = "completed",
    message = "",
}) => {
    return {
        step: step ? step._id : null,
        stepName: step ? step.name : "",
        stepType: step ? step.stepType : "",
        evaluatedRules: evaluatedRules.map((rule) => ({
            condition: rule.condition,
            result: rule.result,
            nextStep: rule.nextStep || null,
        })),
        selectedNextStep: selectedRule ? selectedRule.nextStep : null,
        status,
        message,
        startedAt: new Date(),
        endedAt: new Date(),
    };
};

const runExecution = async (executionId) => {
    const execution = await Execution.findById(executionId);
    if (!execution) {
        throw new Error("Execution not found");
    }

    const workflow = await Workflow.findById(execution.workflow);
    if (!workflow) {
        execution.status = "failed";
        execution.logs.push({
            stepName: "",
            stepType: "",
            evaluatedRules: [],
            status: "Failed",
            message: "Workflow not found",
            startedAt: new Date(),
            endedAt: new Date(),
        });
        execution.endedAt = new Date();
        await execution.save();
        return execution;
    }

    let currentStepId = execution.currentStep  || workflow.startStep;

    if (!currentStepId) {
        execution.status = "failed";
        execution.logs.push({
            stepName: "",
            stepType: "",
            evaluatedRules: [],
            status: "failed",
            message: "Start step is not configured ",
            startedAt: new Date(),
            endedAt: new Date(),
        });
        execution.endedAt = new Date();
        await execution.save();
        return execution;
    }

    execution.status = "in_progress";
    await execution.save();

    const MAX_STEPS = process.env.MAX_EXECUTION_STEPS || 50;
    let stepCount = 0;
    
    while (currentStepId) {
        const step = await Step.findById(currentStepId);
        if (++stepCount > MAX_STEPS) {
        execution.status = "failed";
        execution.logs.push({ message: "Max step limit reached — possible infinite loop" });
        break;
        } 
        if (!step) {
            execution.status = "failed";
            execution.logs.push({
                step: currentStepId,
                stepType: "",
                evaluatedRules: [],
                status: "failed",
                message: "Step not found",
                startedAt: new Date(),
                endedAt: new Date(),
            });
            execution.endedAt = new Date();
            await execution.save();
            return execution;
        }

        const { selectedRule, evaluatedRules } = await evaluateRulesForStep(
            step._id,
            execution.inputData
        );

        const logEntry = buildLogEntry({
            step,
            evaluatedRules,
            selectedRule,
            status: "completed",
            message: `${step.stepType} step processed` ,
        });

        execution.logs.push(logEntry);

        if (!selectedRule || !selectedRule.nextStep) {
            execution.currentStep = null;
            execution.status = "completed";
            execution.endedAt = new Date();
            await execution.save();
            return execution;
        }

        execution.currentStep = selectedRule.nextStep;
        await execution.save();

        currentStepId = selectedRule.nextStep;
    }

    execution.status = "completed";
    execution.endedAt = new Date();
    await execution.save();

    return execution;
};

module.exports = {
    runExecution,
};