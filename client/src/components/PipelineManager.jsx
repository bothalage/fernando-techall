import { useEffect, useState } from "react";
import api from "../api/client";
import toast from "react-hot-toast";
import {
  GitBranch,
  Play,
  Pause,
  LogsIcon,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Plus,
} from "lucide-react";

export default function PipelineManager() {
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [pipelineDetails, setPipelineDetails] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPipeline, setNewPipeline] = useState({
    name: "",
    type: "cicd",
    schedule: "0 * * * *",
  });

  useEffect(() => {
    loadPipelines();
  }, []);

  const loadPipelines = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pipelines");
      setPipelines(res.data);
    } catch (e) {
      console.error("Load pipelines error:", e);
      toast.error("Failed to load pipelines");
    } finally {
      setLoading(false);
    }
  };

  const loadPipelineDetails = async (id) => {
    try {
      const [detailsRes, logsRes, statsRes] = await Promise.all([
        api.get(`/pipelines/${id}`),
        api.get(`/pipelines/${id}/logs`),
        api.get(`/pipelines/${id}/stats`),
      ]);
      setPipelineDetails({ ...detailsRes.data, stats: statsRes.data });
      setLogs(logsRes.data.logs);
      setSelectedPipeline(id);
    } catch (e) {
      toast.error("Failed to load pipeline details");
    }
  };

  const handleTrigger = async (id) => {
    try {
      const res = await api.post(`/pipelines/${id}/trigger`);
      toast.success("Pipeline triggered");
      loadPipelineDetails(id);
    } catch (e) {
      toast.error("Failed to trigger pipeline");
    }
  };

  const handleCreatePipeline = async () => {
    try {
      const res = await api.post("/pipelines", newPipeline);
      toast.success("Pipeline created");
      setNewPipeline({ name: "", type: "cicd", schedule: "0 * * * *" });
      setShowCreateForm(false);
      loadPipelines();
    } catch (e) {
      toast.error("Failed to create pipeline");
    }
  };

  if (loading) return <div className="p-6 text-center text-muted">Loading pipelines...</div>;

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text mb-1">Pipelines</h2>
          <p className="text-muted text-sm">Manage CI/CD, data, email, and analytics pipelines</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="glass rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-primary/10 transition-colors font-semibold"
        >
          <Plus size={16} />
          New Pipeline
        </button>
      </div>

      {/* Create Pipeline Form */}
      {showCreateForm && (
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4">Create New Pipeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Pipeline name"
              value={newPipeline.name}
              onChange={(e) => setNewPipeline({ ...newPipeline, name: e.target.value })}
              className="bg-surface/60 rounded-lg px-4 py-2 text-text placeholder-muted outline-none focus:ring-2 focus:ring-primary/50"
            />
            <select
              value={newPipeline.type}
              onChange={(e) => setNewPipeline({ ...newPipeline, type: e.target.value })}
              className="bg-surface/60 rounded-lg px-4 py-2 text-text outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="cicd">CI/CD</option>
              <option value="data">Data Pipeline</option>
              <option value="email">Email Notification</option>
              <option value="analytics">Analytics</option>
            </select>
            <input
              type="text"
              placeholder="Cron schedule (e.g., 0 * * * *)"
              value={newPipeline.schedule}
              onChange={(e) => setNewPipeline({ ...newPipeline, schedule: e.target.value })}
              className="bg-surface/60 rounded-lg px-4 py-2 text-text placeholder-muted outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={handleCreatePipeline}
              className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Create Pipeline
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-surface/60 text-text rounded-lg font-semibold hover:bg-surface/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pipelines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pipelines.map((pipeline) => (
          <div
            key={pipeline.id}
            role="button"
            onClick={() => loadPipelineDetails(pipeline.id)}
            className={`glass rounded-2xl p-6 text-left transition-all cursor-pointer ${
              selectedPipeline === pipeline.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-surface/40"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <GitBranch size={20} className="text-primary" />
                <div>
                  <h3 className="font-semibold text-text">{pipeline.name}</h3>
                  <div className="text-xs text-muted mt-1 capitalize">{pipeline.type} Pipeline</div>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  pipeline.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {pipeline.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <div className="text-xs text-muted">Runs</div>
                <div className="font-semibold text-text">{pipeline.runs}</div>
              </div>
              <div>
                <div className="text-xs text-muted">Success Rate</div>
                <div className="font-semibold text-accent">{pipeline.successRate}%</div>
              </div>
              <div>
                <div className="text-xs text-muted">Last Run</div>
                <div className="text-xs text-muted">{new Date(pipeline.lastRun).toLocaleTimeString()}</div>
              </div>
            </div>

            <div className="bg-surface/40 rounded-lg px-3 py-2 mb-3 text-sm text-muted italic">{pipeline.description}</div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrigger(pipeline.id);
                }}
                className="flex-1 px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded font-semibold text-sm transition-colors flex items-center justify-center gap-1"
              >
                <Play size={14} />
                Run
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  loadPipelineDetails(pipeline.id);
                }}
                className="flex-1 px-3 py-1 bg-surface/60 hover:bg-surface/80 text-text rounded font-semibold text-sm transition-colors flex items-center justify-center gap-1"
              >
                <Settings size={14} />
                Config
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Details Panel */}
      {pipelineDetails && (
        <div className="glass rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <GitBranch size={18} />
              {pipelines.find((p) => p.id === selectedPipeline)?.name}
            </h3>
            <button type="button" className="text-muted hover:text-text transition-colors" onClick={() => setSelectedPipeline(null)}>
              ×
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Runs", value: pipelineDetails.stats.totalRuns },
              { label: "Success Rate", value: `${pipelineDetails.stats.successRate}%` },
              { label: "Uptime", value: pipelineDetails.stats.uptime },
              { label: "Avg Duration", value: pipelineDetails.stats.avgDuration },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface/40 rounded-lg p-3">
                <div className="text-xs text-muted mb-1">{stat.label}</div>
                <div className="font-semibold text-text">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Recent Runs */}
          <div className="mb-6">
            <h4 className="font-semibold text-sm mb-3">Recent Runs</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {pipelineDetails.runs.map((run) => (
                <div key={run.runId} className="bg-surface/40 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {run.status === "success" ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : run.status === "failed" ? (
                      <AlertCircle size={16} className="text-red-400" />
                    ) : (
                      <Clock size={16} className="text-yellow-400" />
                    )}
                    <div className="text-sm">
                      <div className="font-semibold text-text">{run.runId}</div>
                      <div className="text-xs text-muted">{new Date(run.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted">{run.duration}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Logs */}
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <LogsIcon size={16} />
              Pipeline Logs
            </h4>
            <div className="bg-surface/40 rounded-lg p-3 font-mono text-xs text-muted max-h-48 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="text-text/80">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
