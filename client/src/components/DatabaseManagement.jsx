import { useEffect, useState } from "react";
import api from "../api/client";
import toast from "react-hot-toast";
import { Database, Download, Upload, RotateCcw, Trash2, Save, ChevronDown } from "lucide-react";

export default function DatabaseManagement() {
  const [stats, setStats] = useState(null);
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCollection, setExpandedCollection] = useState(null);
  const [collections, setCollections] = useState({});

  useEffect(() => {
    loadDatabaseInfo();
  }, []);

  const loadDatabaseInfo = async () => {
    try {
      setLoading(true);
      const [statsRes, backupsRes] = await Promise.all([
        api.get("/database/stats"),
        api.get("/database/backups"),
      ]);
      setStats(statsRes.data);
      setBackups(backupsRes.data);
    } catch (e) {
      console.error("Load database info error:", e);
      toast.error("Failed to load database info");
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      const res = await api.post("/database/backup");
      toast.success(`Backup created: ${res.data.backup.id}`);
      loadDatabaseInfo();
    } catch (e) {
      toast.error("Backup failed");
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.post("/database/export");
      toast.success(`Export prepared: ${res.data.recordCount} records`);
    } catch (e) {
      toast.error("Export failed");
    }
  };

  const handleOptimize = async () => {
    try {
      const res = await api.post("/database/optimize");
      toast.success("Database optimized");
    } catch (e) {
      toast.error("Optimization failed");
    }
  };

  const handleCleanup = async () => {
    if (!confirm("Delete records older than 90 days?")) return;
    try {
      const res = await api.post("/database/cleanup", { olderThanDays: 90 });
      toast.success(`Cleanup completed: ${res.data.deleted.total} records deleted`);
      loadDatabaseInfo();
    } catch (e) {
      toast.error("Cleanup failed");
    }
  };

  const restoreBackup = async (backupId) => {
    toast.error("Restore functionality is not available in this demo.");
    console.warn("Restore requested for backup", backupId);
  };

  const loadCollectionData = async (collection) => {
    try {
      const res = await api.get(`/database/collections/${collection}`);
      setCollections((prev) => ({ ...prev, [collection]: res.data }));
      setExpandedCollection(expandedCollection === collection ? null : collection);
    } catch (e) {
      toast.error(`Failed to load ${collection}`);
    }
  };

  if (loading) return <div className="p-6 text-center text-muted">Loading database info...</div>;

  const totalRecords = stats?.collections
    ? Object.values(stats.collections).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Records", value: totalRecords },
          { label: "Collections", value: Object.keys(stats?.collections || {}).length },
          { label: "Backups", value: backups.length },
          { label: "Last Backup", value: backups[0] ? new Date(backups[0].timestamp).toLocaleDateString() : "None" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4">
            <div className="text-xs text-muted mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-text">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={handleBackup}
          className="glass rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors text-sm font-semibold"
        >
          <Save size={16} />
          Backup
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="glass rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors text-sm font-semibold"
        >
          <Download size={16} />
          Export
        </button>
        <button
          type="button"
          onClick={handleOptimize}
          className="glass rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:bg-accent/10 transition-colors text-sm font-semibold"
        >
          <RotateCcw size={16} />
          Optimize
        </button>
        <button
          type="button"
          onClick={handleCleanup}
          className="glass rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors text-sm font-semibold text-red-400"
        >
          <Trash2 size={16} />
          Cleanup
        </button>
      </div>

      {/* Collections Overview */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Database size={18} />
          Collections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {stats?.collections &&
            Object.entries(stats.collections).map(([collection, count]) => (
              <button
                key={collection}
                onClick={() => loadCollectionData(collection)}
                className="glass rounded-lg p-4 text-left hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold capitalize text-sm">{collection}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${expandedCollection === collection ? "rotate-180" : ""}`}
                  />
                </div>
                <div className="text-2xl font-bold text-text">{count}</div>
                <div className="text-xs text-muted mt-1">records</div>
              </button>
            ))}
        </div>
      </div>

      {/* Expanded Collection Data */}
      {expandedCollection && collections[expandedCollection] && (
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 capitalize">
            {expandedCollection} Details ({collections[expandedCollection].count} records)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-2 px-3 font-semibold text-muted">ID</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted">Name/Title</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted">Created</th>
                </tr>
              </thead>
              <tbody>
                {collections[expandedCollection].data.slice(0, 10).map((item) => (
                  <tr key={item._id} className="border-b border-surface/40 hover:bg-surface/20">
                    <td className="py-2 px-3 font-mono text-xs text-muted truncate max-w-xs">{item._id}</td>
                    <td className="py-2 px-3">{item.name || item.title || item.subject || "—"}</td>
                    <td className="py-2 px-3 text-muted">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Backups */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Backups</h3>
        <div className="space-y-3">
          {backups.map((backup) => (
            <div key={backup.id} className="bg-surface/40 rounded-lg p-4 flex justify-between items-center">
              <div>
                <div className="font-semibold text-sm">{backup.id}</div>
                <div className="text-xs text-muted mt-1">
                  {new Date(backup.timestamp).toLocaleString()} • {backup.records} records • {backup.size}
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                  {backup.status}
                </span>
                <button
                  type="button"
                  onClick={() => restoreBackup(backup.id)}
                  className="text-accent hover:text-primary transition-colors text-sm font-semibold"
                >
                  Restore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
