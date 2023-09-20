import { config } from "dotenv";
import type { Config } from "drizzle-kit";

if (process.env.NODE_ENV === "production") {
  config({ path: ".production.vars" });
} else {
  config({ path: ".dev.vars" });
}

export default {
  schema: "./app/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
    authToken: process.env.DATABASE_AUTH_TOKEN as string,
  },
  out: "./app/db/migrations",
} satisfies Config;
