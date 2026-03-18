const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");


dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Halleyx Workflow API is running"
    });
});

app.use("/api/workflows", require("./routes/workflowRoutes"));
app.use("/api/steps", require("./routes/stepRoutes"));
app.use("/api/rules", require("./routes/ruleRoutes"));
app.use("/api/executions", require("./routes/executionRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});