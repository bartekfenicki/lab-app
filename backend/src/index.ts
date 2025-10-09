import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import roleRoutes from "./routes/roleRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import newsPostRoutes from "./routes/newsPostRoutes.js";
import { setupSwagger } from "./config/swagger.js";
import shiftRoutes from "./routes/shiftRoutes.js";
import hoursRoutes from "./routes/hoursRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import newsReactionRoutes from "./routes/newsReactionRoutes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
setupSwagger(app);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/roles", roleRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/news", newsPostRoutes);
app.use("/api/shifts", shiftRoutes)
app.use("/api/hours", hoursRoutes)
app.use("/api/availability", availabilityRoutes)
app.use("/api/login", authRoutes)
app.use("/api/newsreaction", newsReactionRoutes)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Test route
app.get("/api/health", (req, res) => res.send("API is healthy ✅"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}/api/health`);
  console.log(`📄 Swagger docs available at http://localhost:${PORT}/api/docs`);
});