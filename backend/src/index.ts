import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { sendSuccess } from "./utils/response.js";

import toursRouter from "./routes/tours.js";
import availabilityRouter from "./routes/availability.js";
import bookingsRouter from "./routes/bookings.js";
import accountRouter from "./routes/account.js";
import enquiriesRouter from "./routes/enquiries.js";
import reviewsRouter from "./routes/reviews.js";
import adminRouter from "./routes/admin.js";

const app = express();

// Security & Utility Middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// Health Check Endpoint
app.get("/api/health", (req: Request, res: Response) => {
  return sendSuccess(res, {
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: "Ram Tours & Safaris API Backend",
  });
});

// Feature Routes
app.use("/api/tours", toursRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/account", accountRouter);
app.use("/api/enquiries", enquiriesRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/admin", adminRouter);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// Central Error Handler
app.use(errorHandler);

import { connectMongoDB } from "./db/mongodb.js";
import { seedMongoTours } from "./db/seedMongo.js";

// Start Server (only when not running tests)
if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, async () => {
    console.log(`🚀 Ram Tours Backend Server running on port ${config.port} (${config.nodeEnv} mode)`);
    console.log(`👉 Health check: http://localhost:${config.port}/api/health`);
    
    const connected = await connectMongoDB();
    if (connected) {
      await seedMongoTours();
    }
  });
}

export default app;
