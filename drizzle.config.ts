import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Parse connection string
const connectionString = new URL(process.env.DATABASE_URL);

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: connectionString.hostname,
    user: connectionString.username,
    password: connectionString.password,
    database: connectionString.pathname.slice(1), // Remove leading slash
    port: Number(connectionString.port),
    ssl: true,
  },
} satisfies Config; 