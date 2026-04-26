const router = require("express").Router();
const Ticket = require("../models/Ticket");
const Chat = require("../models/Chat");
const User = require("../models/User");
const { protect, allow } = require("../middleware/auth");

// Analytics for admin dashboard
router.get("/overview", protect, allow("admin"), async (req, res) => {
  try {
    const company = req.user.company;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalTickets,
      openTickets,
      resolvedTickets,
      totalChats,
      activeChats,
      totalUsers,
      teamMembers,
      recentTickets,
      recentChats
    ] = await Promise.all([
      Ticket.countDocuments({ company }),
      Ticket.countDocuments({ company, status: "open" }),
      Ticket.countDocuments({ company, status: "resolved" }),
      Chat.countDocuments({ company }),
      Chat.countDocuments({ company, status: "active" }),
      User.countDocuments({ company }),
      User.countDocuments({ company, role: { $ne: "user" } }),
      Ticket.find({ company }).sort("-createdAt").limit(5)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email"),
      Chat.find({ company }).sort("-updatedAt").limit(5)
        .populate("customer", "name email")
        .populate("agent", "name email")
    ]);

    const ticketResolutionRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0;
    const avgResponseTime = "< 2 hours"; // Could be calculated from actual timestamps

    res.json({
      metrics: {
        totalTickets,
        openTickets,
        resolvedTickets,
        ticketResolutionRate,
        totalChats,
        activeChats,
        totalUsers,
        teamMembers,
        avgResponseTime
      },
      recentActivity: {
        tickets: recentTickets,
        chats: recentChats
      }
    });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// Ticket metrics
router.get("/tickets", protect, allow("admin", "it_support_agent"), async (req, res) => {
  try {
    const company = req.user.company;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const byStatus = await Ticket.aggregate([
      { $match: { company } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const byPriority = await Ticket.aggregate([
      { $match: { company } },
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    const createdLast30Days = await Ticket.countDocuments({
      company,
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      byStatus: byStatus.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {}),
      byPriority: byPriority.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {}),
      createdLast30Days
    });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// Chat metrics
router.get("/chats", protect, allow("admin", "customer_care_manager"), async (req, res) => {
  try {
    const company = req.user.company;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const byStatus = await Chat.aggregate([
      { $match: { company } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const avgMessagesPerChat = await Chat.aggregate([
      { $match: { company } },
      { $group: { _id: null, avg: { $avg: { $size: "$messages" } } } }
    ]);

    const createdLast30Days = await Chat.countDocuments({
      company,
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      byStatus: byStatus.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {}),
      avgMessagesPerChat: Math.round(avgMessagesPerChat[0]?.avg || 0),
      createdLast30Days
    });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// Team performance
router.get("/team", protect, allow("admin", "hr_manager"), async (req, res) => {
  try {
    const company = req.user.company;

    const agentStats = await User.aggregate([
      { $match: { company, role: "it_support_agent" } },
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "assignedTo",
          as: "tickets"
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          assignedTickets: { $size: "$tickets" },
          resolvedTickets: {
            $size: {
              $filter: {
                input: "$tickets",
                as: "t",
                cond: { $eq: ["$$t.status", "resolved"] }
              }
            }
          }
        }
      }
    ]);

    const careStats = await User.aggregate([
      { $match: { company, role: "customer_care_agent" } },
      {
        $lookup: {
          from: "chats",
          localField: "_id",
          foreignField: "agent",
          as: "chats"
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          activeChats: {
            $size: {
              $filter: {
                input: "$chats",
                as: "c",
                cond: { $eq: ["$$c.status", "active"] }
              }
            }
          },
          closedChats: {
            $size: {
              $filter: {
                input: "$chats",
                as: "c",
                cond: { $eq: ["$$c.status", "closed"] }
              }
            }
          }
        }
      }
    ]);

    res.json({
      itSupport: agentStats,
      customerCare: careStats
    });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

module.exports = router;
