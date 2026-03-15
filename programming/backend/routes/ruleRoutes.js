const express = require("express");
const router = express.Router();
const {
    createRule,
    getRulesByStep,
    updateRule,
    deleteRule,
} = require("../controllers/ruleController");

router.post("/step/:stepId", createRule);
router.get("/step/:stepId", getRulesByStep);
router.put("/:id", updateRule);
router.delete("/:id", deleteRule);

module.exports = router;