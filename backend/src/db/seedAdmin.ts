import { connectMongoDB, MongoUser } from "./mongodb.js";

export const ADMIN_CREDENTIALS = {
  email: "admin@ramtours.com",
  password: "AdminPassword123!",
  name: "Ram Tours Admin",
  phone: "+91 9876543210",
  role: "admin",
};

export const SECONDARY_ADMIN_CREDENTIALS = {
  email: "ramadventure143@gmail.com",
  password: "AdminPassword123!",
  name: "Ram Adventure Admin",
  phone: "+91 9847123456",
  role: "admin",
};

export async function seedAdminUser() {
  console.log("🌱 Starting Admin Role Seeding in MongoDB...");
  console.log("----------------------------------------");

  const connected = await connectMongoDB();
  if (!connected) {
    console.error("❌ Failed to connect to MongoDB.");
    return;
  }

  const adminAccountList = [ADMIN_CREDENTIALS, SECONDARY_ADMIN_CREDENTIALS];

  for (const adminCreds of adminAccountList) {
    try {
      const user = await MongoUser.findOneAndUpdate(
        { email: adminCreds.email.toLowerCase() },
        {
          name: adminCreds.name,
          email: adminCreds.email.toLowerCase(),
          password: adminCreds.password,
          role: "admin",
          phone: adminCreds.phone,
        },
        { upsert: true, returnDocument: "after" }
      );
      console.log(`✅ MongoDB Admin User synced: ${user.email} (ID: ${user._id})`);
    } catch (err: any) {
      console.error(`❌ Error syncing admin account ${adminCreds.email}:`, err?.message || err);
    }
  }

  console.log("\n========================================");
  console.log("🎉 ADMIN ROLE & CREDENTIALS CREATED IN MONGODB!");
  console.log("========================================");
  console.log(` Primary Admin Email   : ${ADMIN_CREDENTIALS.email}`);
  console.log(` Primary Admin Password: ${ADMIN_CREDENTIALS.password}`);
  console.log(` Role                   : admin`);
  console.log("----------------------------------------");
  console.log(` Secondary Admin Email : ${SECONDARY_ADMIN_CREDENTIALS.email}`);
  console.log(` Secondary Password    : ${SECONDARY_ADMIN_CREDENTIALS.password}`);
  console.log(` Role                   : admin`);
  console.log("========================================\n");
}

if (process.argv[1]?.endsWith("seedAdmin.ts") || process.argv[1]?.endsWith("seedAdmin.js")) {
  seedAdminUser()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Admin seeding failed:", err);
      process.exit(1);
    });
}
