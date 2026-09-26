import { createClient } from "@supabase/supabase-js";
import { publicSupabaseClient } from "./supabase.js";
import { config } from "../config/env.js";
import { connectMongoDB } from "./mongodb.js";
import mongoose from "mongoose";

export const ADMIN_CREDENTIALS = {
  email: "admin@ramtours.com",
  password: "AdminPassword123!",
  name: "Ram Tours Admin",
  phone: "+91 9876543210",
  role: "admin",
};

// Also support secondary fallback admin email
export const SECONDARY_ADMIN_CREDENTIALS = {
  email: "ramadventure143@gmail.com",
  password: "AdminPassword123!",
  name: "Ram Adventure Admin",
  phone: "+91 9847123456",
  role: "admin",
};

export async function seedAdminUser() {
  console.log("🌱 Starting Admin Role Seeding...");
  console.log("----------------------------------------");

  const adminAccountList = [ADMIN_CREDENTIALS, SECONDARY_ADMIN_CREDENTIALS];

  let supabaseAdmin = publicSupabaseClient;
  const hasServiceKey = Boolean(config.supabaseServiceRoleKey && config.supabaseServiceRoleKey.trim().length > 0);

  if (hasServiceKey) {
    console.log("🔑 Using Supabase Service Role Key for elevated user creation.");
    supabaseAdmin = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  } else {
    console.log("ℹ️  Service Role Key not set. Using Public Supabase Anon Client for seeding.");
  }

  for (const adminCreds of adminAccountList) {
    let userId: string | null = null;

    try {
      if (hasServiceKey) {
        // 1. Try creating user via Admin API
        const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: adminCreds.email,
          password: adminCreds.password,
          email_confirm: true,
          user_metadata: { name: adminCreds.name, role: adminCreds.role },
        });

        if (createData?.user) {
          userId = createData.user.id;
          console.log(`✅ Supabase Auth user created: ${adminCreds.email} (ID: ${userId})`);
        } else if (createErr?.message?.includes("already") || createErr?.status === 422) {
          // User already exists, fetch list to find ID
          const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = userList?.users?.find((u) => u.email?.toLowerCase() === adminCreds.email.toLowerCase());
          if (existingUser) {
            userId = existingUser.id;
            console.log(`ℹ️  Existing Supabase Auth user found: ${adminCreds.email} (ID: ${userId})`);
          }
        } else if (createErr) {
          console.warn(`⚠️  Admin createUser notice for ${adminCreds.email}: ${createErr.message}`);
        }
      }

      if (!userId) {
        // 2. Fallback to public sign up or sign in
        const { data: signData, error: signErr } = await publicSupabaseClient.auth.signUp({
          email: adminCreds.email,
          password: adminCreds.password,
          options: {
            data: { name: adminCreds.name },
          },
        });

        if (signData?.user) {
          userId = signData.user.id;
          console.log(`✅ Supabase Auth user registered via signUp: ${adminCreds.email}`);
        } else {
          // Attempt sign in if already registered
          const { data: loginData } = await publicSupabaseClient.auth.signInWithPassword({
            email: adminCreds.email,
            password: adminCreds.password,
          });
          if (loginData?.user) {
            userId = loginData.user.id;
            console.log(`ℹ️  Logged into existing account: ${adminCreds.email}`);
          }
        }
      }

      // If we have a user ID, seed profiles and user_roles in Supabase
      if (userId) {
        const { error: profileErr } = await supabaseAdmin.from("profiles").upsert(
          {
            id: userId,
            name: adminCreds.name,
            email: adminCreds.email,
            phone: adminCreds.phone,
            is_active: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

        if (profileErr) {
          console.warn(`⚠️  Profile upsert warning for ${adminCreds.email}:`, profileErr.message);
        } else {
          console.log(`✅ Profile updated for ${adminCreds.email}`);
        }

        const { error: roleErr } = await supabaseAdmin.from("user_roles").upsert(
          {
            user_id: userId,
            role: adminCreds.role as "admin",
          },
          { onConflict: "user_id,role" }
        );

        if (roleErr) {
          console.warn(`⚠️  user_roles upsert warning for ${adminCreds.email}:`, roleErr.message);
        } else {
          console.log(`👑 Assigned 'admin' role in user_roles for ${adminCreds.email}`);
        }
      }
    } catch (err: any) {
      console.error(`❌ Error processing admin account ${adminCreds.email}:`, err?.message || err);
    }
  }

  // 3. Mongo DB Seeding check
  try {
    const mongoOk = await connectMongoDB();
    if (mongoOk && mongoose.connection.db) {
      const usersCollection = mongoose.connection.db.collection("users");
      for (const adminCreds of adminAccountList) {
        await usersCollection.updateOne(
          { email: adminCreds.email },
          {
            $set: {
              email: adminCreds.email,
              name: adminCreds.name,
              role: "admin",
              phone: adminCreds.phone,
              updatedAt: new Date(),
            },
            $setOnInsert: { createdAt: new Date() },
          },
          { upsert: true }
        );
        console.log(`✅ MongoDB admin record synced: ${adminCreds.email}`);
      }
    }
  } catch (mErr: any) {
    console.warn("ℹ️  MongoDB admin sync notice:", mErr?.message || mErr);
  }

  console.log("\n========================================");
  console.log("🎉 ADMIN ROLE & CREDENTIALS CREATED!");
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
