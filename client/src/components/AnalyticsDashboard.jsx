import { useEffect, useState } from "react";
import api from "../api/client";
import { BarChart3, TrendingUp, Users, MessageSquare, Ticket, Clock } from "lucide-react";

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketStats, setTicketStats] = useState(null);
  const [chatStats, setChatStats] = useState(null);
  const [teamStats, setTeamStats] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [overview, tickets, chats, team] = await Promise.all([
        api.get("/analytics/overview"),
        api.get("/analytics/tickets"),
        api.get("/analytics/chats"),
        api.get("/analytics/team")
      ]);
      setMetrics(overview.data);
      setTicketStats(tickets.data);
      setChatStats(chats.data);
      setTeamStats(team.data);
    } catch (e) {
      console.error("Failed to load analytics:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-muted">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Ticket size={20} />}
          label="Total Tickets"
          value={metrics?.metrics?.totalTickets || 0}
          trend={`${metrics?.metrics?.openTickets || 0} open`}
        />
        <MetricCard
          icon={<TrendingUp size={20} />}
          label="Resolution Rate"
          value={`${metrics?.metrics?.ticketResolutionRate || 0}%`}
          trend={`${metrics?.metrics?.resolvedTickets || 0} resolved`}
        />
        <MetricCard
          icon={<MessageSquare size={20} />}
          label="Active Chats"
          value={metrics?.metrics?.activeChats || 0}
          trend={`${metrics?.metrics?.totalChats || 0} total`}
        />
        <MetricCard
          icon={<Users size={20} />}
          label="Team Members"
          value={metrics?.metrics?.teamMembers || 0}
          trend={`${metrics?.metrics?.totalUsers || 0} users`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ticket Status Distribution */}
        {ticketStats && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <BarChart3 size={18} />
              Tickets by Status
            </h3>
            <div className="space-y-3">
              {Object.entries(ticketStats.byStatus || {}).map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{status}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="w-full bg-surface/40 rounded-full h-2">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      style={{ width: `${(count / (metrics?.metrics?.totalTickets || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Metrics */}
        {chatStats && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MessageSquare size={18} />
              Chat Analytics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-surface/40 rounded-lg">
                <span>Avg Messages per Chat</span>
                <span className="font-semibold text-accent">{chatStats.avgMessagesPerChat}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface/40 rounded-lg">
                <span>Chats (Last 30 Days)</span>
                <span className="font-semibold text-primary">{chatStats.createdLast30Days}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Team Performance */}
      {teamStats && (
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Users size={18} />
            Team Performance
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* IT Support */}
            <div>
              <h4 className="text-sm font-semibold text-muted mb-3">IT Support Agents</h4>
              <div className="space-y-2">
                {teamStats.itSupport?.map((agent) => (
                  <div key={agent._id} className="p-3 bg-surface/40 rounded-lg">
                    <div className="font-sm font-medium">{agent.name}</div>
                    <div className="text-xs text-muted mt-1">
                      {agent.assignedTickets} assigned • {agent.resolvedTickets} resolved
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="text-sm font-semibold text-muted mb-3">Customer Care Agents</h4>
              <div className="space-y-2">
                {teamStats.customerCare?.map((agent) => (
                  <div key={agent._id} className="p-3 bg-surface/40 rounded-lg">
                    <div className="font-sm font-medium">{agent.name}</div>
                    <div className="text-xs text-muted mt-1">
                      {agent.activeChats} active • {agent.closedChats} closed
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {metrics?.recentActivity && (
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-muted mb-3">Recent Tickets</h4>
              <div className="space-y-2">
                {metrics.recentActivity.tickets.map((t) => (
                  <div key={t._id} className="p-2 text-sm border-l-2 border-primary/50 pl-3">
                    <div className="font-medium truncate">{t.subject}</div>
                    <div className="text-xs text-muted">{t.createdBy?.name}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-muted mb-3">Recent Chats</h4>
              <div className="space-y-2">
                {metrics.recentActivity.chats.map((c) => (
                  <div key={c._id} className="p-2 text-sm border-l-2 border-accent/50 pl-3">
                    <div className="font-medium truncate">{c.customer?.name || "User"}</div>
                    <div className="text-xs text-muted">{c.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value, trend }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="text-primary/60">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-text mb-1">{value}</div>
      <div className="text-xs text-muted">{label}</div>
      {trend && <div className="text-xs text-accent mt-2">{trend}</div>}
    </div>
  );
}
