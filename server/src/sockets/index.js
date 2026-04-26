const Chat = require("../models/Chat");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = function registerSockets(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("no token"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("invalid"));
      socket.user = user;
      next();
    } catch (e) { next(new Error("auth failed")); }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user._id}`);
    if (["admin","customer_care_manager","customer_care_agent"].includes(socket.user.role)) socket.join("agents");

    socket.on("chat:join", (chatId) => socket.join(`chat:${chatId}`));

    socket.on("chat:message", async ({ chatId, text }) => {
      if (!text?.trim()) return;
      const chat = await Chat.findById(chatId);
      if (!chat) return;
      const allowed =
        chat.customer.toString() === socket.user._id.toString() ||
        (chat.agent && chat.agent.toString() === socket.user._id.toString()) ||
        ["admin","customer_care_manager"].includes(socket.user.role);
      if (!allowed) return;
      const msg = { from: socket.user._id, text: text.slice(0, 2000), at: new Date() };
      chat.messages.push(msg);
      await chat.save();
      const payload = { chatId, message: { ...msg, fromName: socket.user.name, fromRole: socket.user.role } };
      io.to(`chat:${chatId}`).emit("chat:message", payload);
      io.to("agents").emit("chat:notify", payload);

      const shouldAutoReply =
        socket.user.role === "user" &&
        !chat.agent &&
        chat.status !== "closed";

      if (shouldAutoReply) {
        setTimeout(async () => {
          const freshChat = await Chat.findById(chatId);
          if (!freshChat || freshChat.agent || freshChat.status === "closed") return;
          const aiReply = {
            from: null,
            text: "TechAll AI is here. A care agent will join soon. In the meantime, please share your company name, issue type, and the best callback number.",
            at: new Date()
          };
          freshChat.messages.push(aiReply);
          await freshChat.save();
          io.to(`chat:${chatId}`).emit("chat:message", {
            chatId,
            message: { ...aiReply, fromName: "TechAll AI", fromRole: "assistant" }
          });
        }, 900);
      }
    });
  });
};
