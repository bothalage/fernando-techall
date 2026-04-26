const mongoose = require("mongoose");

module.exports = async function connectDB(retries = 5, delay = 3000) {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("MONGODB_URI (or MONGO_URI) missing");

  for (let i = 0; i <= retries; i++) {
    try {
      await mongoose.connect(uri);
      console.log("MongoDB connected");
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1}/${retries + 1} failed:`, err.message);
      if (i < retries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2; // exponential backoff
      } else {
        console.error("MongoDB connection failed after all retries. Server will continue without DB.");
        throw err;
      }
    }
  }
};
