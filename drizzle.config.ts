import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./src/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST ?? "",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER ?? "",
    password: process.env.DB_PASS ?? "",
    database: process.env.DB_NAME ?? "",
    ssl: true
  }
});
