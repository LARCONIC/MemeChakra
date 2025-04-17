import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const runMigration = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log("⏳ Running migrations...");
  
  const start = Date.now();
  await migrate(db, { migrationsFolder: "migrations" });
  const end = Date.now();
  
  console.log(`✅ Migrations completed in ${end - start}ms`);
  process.exit(0);
};

runMigration().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});