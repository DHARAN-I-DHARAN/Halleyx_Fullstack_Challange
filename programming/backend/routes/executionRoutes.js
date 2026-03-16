const express = require("express");
const router = express.Router();
const {
    startExecution,
    getExecutionById,
    getAllExecutions,
    cancelExecution,
    retryExecution,
} = require("../controllers/executionController");

router.post("/workflow/:workflowId", startExecution);
router.get("/", getAllExecutions);
router.get("/:id", getExecutionById);
router.post("/:id/cancel", cancelExecution);
router.post("/:id/retry", retryExecution);

module.exports = router;