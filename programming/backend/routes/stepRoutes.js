const express = require("express");
const router = express.Router();
const {
    createStep,
    getStepsByWorkflow,
    updateStep,
    deleteStep,
} = require("../controllers/stepController");

router.post("/workflow/:workflowId", createStep);
router.get("/workflow/:workflowId", getStepsByWorkflow);
router.put("/:id", updateStep);
router.delete("/:id", deleteStep);

module.exports = router;