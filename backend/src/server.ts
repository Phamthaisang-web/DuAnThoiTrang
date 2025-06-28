import mongoose from "mongoose";
import app from "./app";
import { env } from "./helpers/env.helper";
const PORT = env.PORT || 3000;
console.log("<<=== 🚀 Starting server ===>>",env.PORT);
/// Start the server
const mongooseDbOptions = {
  autoIndex: true, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(env.MONGODB_URI, mongooseDbOptions)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
  })
  .catch((err) => {
    console.error("Failed to Connect to MongoDB", err);
  });