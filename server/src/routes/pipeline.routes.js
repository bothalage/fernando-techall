const express = require("express");
const { protect, allow } = require("../middleware/auth.js");

const router = express.Router();

// Get all pipelines
router.get("/", protect, allow("admin"), async (req, res) => {
  try {
    const pipelines = [
      {
        id: "cicd_main",
        name: "Main CI/CD Pipeline",
        type: "cicd",
        status: "active",
        lastRun: new Date(Date.now() - 3600000),
        nextRun: new Date(Date.now() + 3600000),
        runs: 234,
        successRate: 95.7,
        description: "Build, test, and deploy main branch",
      },
      {
        id: "data_sync",
        name: "Data Sync Pipeline",
        type: "data",
        status: "active",
        lastRun: new Date(Date.now() - 1800000),
        nextRun: new Date(Date.now() + 1800000),
        runs: 487,
        successRate: 99.2,
        description: "Sync customer data from external sources",
      },
      {
        id: "email_notify",
        name: "Email Notification Pipeline",
        type: "email",
        status: "active",
        lastRun: new Date(Date.now() - 600000),
        nextRun: new Date(Date.now() + 300000),
        runs: 1023,
        successRate: 98.5,
        description: "Send automated email notifications",
      },
      {
        id: "analytics_agg",
        name: "Analytics Aggregation",
        type: "analytics",
        status: "active",
        lastRun: new Date(Date.now() - 5400000),
        nextRun: new Date(Date.now() + 1800000),
        runs: 156,
        successRate: 100,
        description: "Aggregate and process analytics data",
      },
    ];

    res.json(pipelines);
  } catch (e) {
    console.error("Pipelines fetch error:", e);
    res.status(500).json({ error: e.message });
  }
});

// Get pipeline details
router.get("/:id", protect, allow("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const details = {
      id,
      status: "active",
      runs: [
        { runId: "run_001", timestamp: new Date(), status: "success", duration: "2.3s" },
        { runId: "run_002", timestamp: new Date(Date.now() - 3600000), status: "success", duration: "2.1s" },
        { runId: "run_003", timestamp: new Date(Date.now() - 7200000), status: "failed", duration: "1.8s", error: "Connection timeout" },
        { runId: "run_004", timestamp: new Date(Date.now() - 10800000), status: "success", duration: "2.2s" },
        { runId: "run_005", timestamp: new Date(Date.now() - 14400000), status: "success", duration: "2.4s" },
      ],
      triggers: [
        { name: "schedule", value: "Every 1 hour", enabled: true },
        { name: "webhook", value: "On push to main", enabled: true },
        { name: "manual", value: "Manual trigger", enabled: true },
      ],
      environment: {
        NODE_ENV: "production",
        LOG_LEVEL: "info",
        TIMEOUT: "300s",
      },
    };

    res.json(details);
  } catch (e) {
    console.error("Pipeline details error:", e);
    res.status(500).json({ error: e.message });
  }
});

// Trigger pipeline manually
router.post("/:id/trigger", protect, allow("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const run = {
      runId: `run_${Date.now()}`,
      pipelineId: id,
      status: "running",
      startTime: new Date(),
      progress: 0,
      logs: ["Pipeline started...", "Initializing environment...", "Executing tasks..."],
    };

    res.json({
      success: true,
      message: "Pipeline triggered successfully",
      run,
    });
  } catch (e) {
    console.error("Trigger pipeline error:", e);
    res.status(500).json({ error: e.message });
  }
});

// Get pipeline logs
router.get("/:id/logs", protect, allow("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const logs = [
      "[2026-04-25 10:30:15] Pipeline started",
      "[2026-04-25 10:30:16] Installing dependencies...",
      "[2026-04-25 10:30:45] Running tests...",
      "[2026-04-25 10:31:20] Tests passed (245 tests)",
      "[2026-04-25 10:31:21] Building application...",
      "[2026-04-25 10:31:45] Build completed successfully",
      "[2026-04-25 10:31:46] Deploying to production...",
      "[2026-04-25 10:32:30] Deployment completed",
      "[2026-04-25 10:32:31] Pipeline completed successfully",
    ];

    res.json({ pipelineId: id, logs, timestamp: new Date() });
  } catch (e) {
    console.error("Pipeline logs error:", e);
    res.status(500).json({ error: e.message });
  }
});

// Create new pipeline
router.post("/", protect, allow("admin"), async (req, res) => {
  try {
    const { name, type, schedule } = req.body;

    const pipeline = {
      id: `pipeline_${Date.now()}`,
      name,
      type,
      schedule,
      status: "active",
      createdAt: new Date(),
      runs: 0,
      successRate: 0,
      lastRun: null,
    };

    res.json({
      success: true,
      message: "Pipeline created successfully",
      pipeline,
    });
  } catch (e) {
    console.error("Create pipeline error:", e);
    res.status(500).json({ error: e.message });
  }
});

// Update pipeline
router.put("/:id", protect, allow("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, schedule, enabled } = req.body;

    res.json({
      success: true,
      message: "Pipeline updated successfully",
      pipeline: { id, name, schedule, enabled, updatedAt: new Date() },
    });
  } catch (e) {
    console.error("Update pipeline error:", e);
    res.status(500).json({ error: e.message });
  }
});

// Delete pipeline
router.delete("/:id", protect, allow("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    res.json({
      success: true,
      message: "Pipeline deleted successfully",
      deletedId: id,
    });
  } catch (e) {
    console.error("Delete pipeline error:", e);
    res.status(500).json({ error: e.message });
  }
});

// Get pipeline statistics
router.get("/:id/stats", protect, allow("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const stats = {
      totalRuns: 234,
      successfulRuns: 224,
      failedRuns: 10,
      successRate: 95.7,
      avgDuration: "2.3s",
      lastRun: new Date(Date.now() - 3600000),
      uptime: "99.7%",
      failureReasons: {
        timeout: 5,
        "connection_error": 3,
        "resource_exhaustion": 2,
      },
    };

    res.json(stats);
  } catch (e) {
    console.error("Pipeline stats error:", e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
