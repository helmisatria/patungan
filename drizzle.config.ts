import { config } from "dotenv";
import type { Config } from "drizzle-kit";
// import { DATABASE_AUTH_TOKEN, DATABASE_URL } from "~/lib/env";

config({ path: ".dev.vars" });

export default {
  schema: "./app/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
    authToken: process.env.DATABASE_AUTH_TOKEN as string,
  },
} satisfies Config;
