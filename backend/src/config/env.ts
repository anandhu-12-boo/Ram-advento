import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUrl:
    process.env.MONGODB_URL ||
    "mongodb+srv://sojan:oXT3qEx7HHmlUNsd@cluster0.vvjc2.mongodb.net/ramms?appName=Cluster0",
  jwtSecret: process.env.AUTH_SECRET || process.env.JWT_SECRET || "ram-adventure-secret-token-key-2026",
};

