require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const registerSockets = require("./sockets");
const paymentRoutes = require("./routes/payments.routes");
const Product = require("./models/Product");
const defaultProducts = require("./config/defaultProducts");

const app = express();
const server = http.createServer(app);

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(morgan("dev"));

app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/services", require("./routes/services.routes"));
app.use("/api/products", require("./routes/products.routes"));
app.use("/api/portfolio", require("./routes/portfolio.routes"));
app.use("/api/testimonials", require("./routes/testimonials.routes"));
app.use("/api/contact", require("./routes/contact.routes"));
app.use("/api/tickets", require("./routes/tickets.routes"));
app.use("/api/chats", require("./routes/chats.routes"));
app.use("/api/ai", require("./routes/ai.routes"));
app.use("/api/analytics", require("./routes/analytics.routes"));
app.use("/api/database", require("./routes/database.routes"));
app.use("/api/pipelines", require("./routes/pipeline.routes"));
app.use("/api/careers", require("./routes/careers.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/mail", require("./routes/mail.routes"));
app.use("/api/payments", paymentRoutes);

app.get("/", (_req, res) => res.json({ ok: true, name: "Fernando TechAll API" }));

const io = new Server(server, { cors: { origin: CLIENT_ORIGIN, credentials: true } });
registerSockets(io);
app.set("io", io);

const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    console.log("Seeding default products...");
    await Product.create(defaultProducts);
  }
  server.listen(PORT, () => console.log(`API + WS running on :${PORT}`));
});
