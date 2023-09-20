import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import type { AppLoadContext } from "@remix-run/cloudflare";

export const getDbFromContext = (context: AppLoadContext) => {
  const env = context.env as Record<string, string>;

  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });

  return drizzle(client);
};

// const result = await db.select().from(users).all();
