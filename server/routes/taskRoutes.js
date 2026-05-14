import express from "express";
import axios from "axios";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import path from "path";
import fs from "fs";
import { createZipArchive } from "../utils/createZip.js";
import { deployProject } from "../services/deploymentService.js";

const router = express.Router();

const AI_ENGINE_URL =
  process.env.AI_ENGINE_URL || "http://localhost:8000";

// Track polling intervals
const taskPollingIntervals = new Map();

function formatGatewayError(error) {
  if (error.response) {
    return {
      status: error.response.status,
      data: error.response.data,
    };
  }

  return {
    status: 500,
    data: {
      error: error.message || "API gateway error",
    },
  };
}

/**
 * Normalize backend agent structure
 */
function buildAgentStatus(data) {
  return {
    planner: data.planner || null,
    researcher: data.researcher || null,
    developer: data.developer || null,
    tester: data.tester || null,
    reporter: data.reporter || null,
  };
}

/**
 * Start polling task updates
 */
function startTaskPolling(taskId, io) {
  // Prevent duplicate polling
  if (taskPollingIntervals.has(taskId)) {
    return;
  }

  let lastKnownState = {};
  let pollCount = 0;

  const pollInterval = setInterval(async () => {
    pollCount++;

    try {
      const response = await axios.get(
        `${AI_ENGINE_URL}/api/task/${taskId}`,
        {
          timeout: 10000,
        }
      );

      const data = response.data;

      console.log(
        `[Polling #${pollCount}] Task ${taskId} status: ${data.status}`
      );

      const agentStatus = buildAgentStatus(data);

      /**
       * Emit task status updates
       */
      if (data.status !== lastKnownState.status) {
        console.log(
          `[Polling #${pollCount}] Status changed: ${lastKnownState.status} -> ${data.status}`
        );

        io.to(`task-${taskId}`).emit("task-update", {
          task_id: taskId,
          status: data.status,
          input: data.input,
        });

        lastKnownState.status = data.status;
      }

      /**
       * Emit agent updates
       */
      Object.entries(agentStatus).forEach(
        ([agentKey, agentData]) => {
          if (!agentData) return;

          const lastState =
            lastKnownState[agentKey] || {};

          if (agentData.status !== lastState.status) {
            console.log(
              `[Polling #${pollCount}] Agent ${agentKey}: ${lastState.status} -> ${agentData.status}`
            );

            io.to(`task-${taskId}`).emit(
              "agent-status-update",
              {
                agent: agentKey,
                status: agentData.status,
                output: agentData.output,
                name: agentData.name,
              }
            );
          }

          lastKnownState[agentKey] = agentData;
        }
      );

      /**
       * Emit task progress
       */
      io.to(`task-${taskId}`).emit("task-progress", {
        task_id: taskId,
        status: data.status,
        logs: data.logs || [],
        agentStatus,
        output: data.output || {},
      });

      /**
       * Emit new logs
       */
      if (data.logs && data.logs.length > 0) {
        const newLogs = data.logs.filter(
          (log) =>
            !lastKnownState.logIds?.includes(log.id)
        );

        newLogs.forEach((log) => {
          io.to(`task-${taskId}`).emit(
            "agent-log",
            {
              agent: log.agent,
              message: log.message,
              timestamp: log.timestamp,
              status: log.status,
            }
          );
        });

        lastKnownState.logIds = data.logs.map(
          (log) => log.id
        );
      }

      /**
       * Stop polling when done
       */
      if (
        data.status === "completed" ||
        data.status === "failed"
      ) {
        console.log(
          `[Polling #${pollCount}] Task ${taskId} finished with status: ${data.status}`
        );
        console.log(`[Polling #${pollCount}] Final data structure:`, JSON.stringify(data, null, 2).slice(0, 500));

        // Generate ZIP and deployment link on successful completion
        let downloadUrl = null;
        let deploymentLink = null;

        if (data.status === "completed") {
          try {
            // Extract project info from developer agent output
           const developerOutput =
  data.output?.developer || {};
            console.log(
  "[DEBUG] FULL DATA STRUCTURE:",
  JSON.stringify(data, null, 2)
);
            console.log(`[ZIP/Deployment] Developer output:`, developerOutput);

            const projectId = developerOutput.project_id;
            const projectDir = developerOutput.project_dir;

            console.log(`[ZIP/Deployment] Extracted - projectId: ${projectId}, projectDir: ${projectDir}`);

            if (projectId && projectDir) {
              // Use relative path from AI-Engine to locate project
             const aiEnginePath = path.resolve(process.cwd(), '..', 'Ai-Engine');
              const fullProjectPath = path.join(aiEnginePath, projectDir);

              console.log(`[ZIP/Deployment] Full project path: ${fullProjectPath}`);
              console.log(`[ZIP/Deployment] Path exists: ${fs.existsSync(fullProjectPath)}`);

              // Generate ZIP archive
              try {
                console.log(`[ZIP] Starting ZIP creation...`);
                const zipResult = await createZipArchive(fullProjectPath, projectId);
                downloadUrl = zipResult.downloadUrl;
                console.log(`[ZIP] ✅ Generated successfully: ${downloadUrl}`);
              } catch (zipError) {
                console.error(`[ZIP] ❌ Failed:`, zipError);
              }

              // Attempt deployment
              try {
                console.log(`[Deployment] Starting deployment...`);
                const deployResult = await deployProject(projectId, {
                  name: data.input?.slice(0, 50) || `project-${projectId.slice(0, 8)}`
                });
                deploymentLink = deployResult.deploymentLink;
                console.log(`[Deployment] ✅ Completed: ${deploymentLink}`);
              } catch (deployError) {
                console.error(`[Deployment] ❌ Failed:`, deployError);
              }
            } else {
              console.warn(`[ZIP/Deployment] ⚠️ Missing project info - projectId: ${projectId}, projectDir: ${projectDir}`);
              console.log(`[ZIP/Deployment] Full developer output:`, JSON.stringify(developerOutput, null, 2));
            }
          } catch (error) {
            console.error(`[ZIP/Deployment] ❌ Outer error:`, error.message);
            console.error(error.stack);
          }
        }

        console.log(`[Workflow Complete] Final values - downloadUrl: ${downloadUrl}, deploymentLink: ${deploymentLink}`);

        io.to(`task-${taskId}`).emit(
          "workflow-complete",
          {
            task_id: taskId,
            status: data.status,
            output: data.output || {},
            agentStatus,
            downloadUrl,
            deploymentLink,
          }
        );

        clearInterval(pollInterval);

        taskPollingIntervals.delete(taskId);

        console.log(
          `[Polling] Stopped polling for task ${taskId} after ${pollCount} polls`
        );
      } else {
        console.log(
          `[Polling #${pollCount}] Task ${taskId} status: ${data.status}`
        );
      }
    } catch (error) {
      console.error(
        `[Polling Error] Task ${taskId}:`,
        error.message
      );

      // Continue polling on errors
    }
  }, 5000);

  taskPollingIntervals.set(taskId, pollInterval);

  console.log(
    `[Polling] Started polling for task ${taskId}`
  );
}

/**
 * Create task
 */
router.post("/task", async (req, res) => {
  const { task } = req.body || {};

  if (
    !task ||
    typeof task !== "string" ||
    !task.trim()
  ) {
    return res.status(400).json({
      error: "Task input is required.",
    });
  }

  try {
    const response = await axios.post(
      `${AI_ENGINE_URL}/api/task`,
      {
        input: task.trim(),
      },
      {
        timeout: 60000,
      }
    );

    const taskId = response.data.task_id;

    const io = req.app.get("io");

    if (io && taskId) {
      io.to(`task-${taskId}`).emit(
        "task-created",
        {
          task_id: taskId,
          status:
            response.data.status || "pending",
          input: response.data.input,
          created_at: response.data.created_at,
        }
      );

      io.to(`task-${taskId}`).emit(
        "task-update",
        {
          task_id: taskId,
          status:
            response.data.status || "pending",
          input: response.data.input,
        }
      );

      // Start realtime polling
      startTaskPolling(taskId, io);
    }

    return res
      .status(response.status)
      .json(response.data);
  } catch (error) {
    const formatted =
      formatGatewayError(error);

    return res
      .status(formatted.status)
      .json(formatted.data);
  }
});

/**
 * Get task
 */
router.get("/task/:taskId", async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({
      error: "Task ID is required.",
    });
  }

  try {
    const response = await axios.get(
      `${AI_ENGINE_URL}/api/task/${taskId}`,
      {
        timeout: 30000,
      }
    );

    const io = req.app.get("io");

    // Ensure polling is active
    if (
      io &&
      !taskPollingIntervals.has(taskId)
    ) {
      startTaskPolling(taskId, io);
    }

    return res
      .status(response.status)
      .json(response.data);
  } catch (error) {
    const formatted =
      formatGatewayError(error);

    return res
      .status(formatted.status)
      .json(formatted.data);
  }
});

/**
 * Get all tasks
 */
router.get("/tasks", async (_req, res) => {
  try {
    const response = await axios.get(
      `${AI_ENGINE_URL}/api/tasks`,
      {
        timeout: 30000,
      }
    );

    return res
      .status(response.status)
      .json(response.data);
  } catch (error) {
    const formatted =
      formatGatewayError(error);

    return res
      .status(formatted.status)
      .json(formatted.data);
  }
});

/**
 * Get memory
 */
router.get("/memory/:taskId", async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({
      error: "Task ID is required.",
    });
  }

  try {
    const response = await axios.get(
      `${AI_ENGINE_URL}/api/memory/${taskId}`,
      {
        timeout: 30000,
      }
    );

    return res
      .status(response.status)
      .json(response.data);
  } catch (error) {
    const formatted =
      formatGatewayError(error);

    return res
      .status(formatted.status)
      .json(formatted.data);
  }
});

/**
 * Empty memory fallback
 */
router.get("/memory", async (_req, res) => {
  return res.status(200).json({
    memory: {},
  });
});

/**
 * Broadcast socket event
 */
router.post("/broadcast", (req, res) => {
  const { task_id, event_type, data } =
    req.body;

  if (!task_id || !event_type || !data) {
    return res.status(400).json({
      error:
        "task_id, event_type, and data are required",
    });
  }

  const io = req.app.get("io");

  if (io) {
    io.to(`task-${task_id}`).emit(
      event_type,
      data
    );

    res.status(200).json({
      success: true,
    });
  } else {
    res.status(500).json({
      error: "Socket.IO not available",
    });
  }
});

/**
 * Emit socket event
 */
router.post("/emit", (req, res) => {
  const { task_id, event_type, data } =
    req.body;

  if (!task_id || !event_type || !data) {
    return res.status(400).json({
      error:
        "task_id, event_type, and data are required",
    });
  }

  const io = req.app.get("io");

  if (io) {
    io.to(`task-${task_id}`).emit(
      event_type,
      data
    );

    res.status(200).json({
      success: true,
    });
  } else {
    res.status(500).json({
      error: "Socket.IO not available",
    });
  }
});

export default router;