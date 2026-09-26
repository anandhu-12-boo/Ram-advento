import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  supabaseUrl: process.env.SUPABASE_URL || "https://c--db38bc43-93f9-46f0-b1ad-c2fcd1040fcb-prod.lovable.cloud",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "sb_publishable_EKJnsCH26E6X0gXBBcjXLQ_I8MJxNvC",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  mongodbUrl: process.env.MONGODB_URL || "mongodb+srv://sojan:oXT3qEx7HHmlUNsd@cluster0.vvjc2.mongodb.net/?appName=Cluster0",
};
