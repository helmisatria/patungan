import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";

export type UserSchema = {
  id: number;
  first_name: string;
  username: string;
  photo_url: string;
  auth_date: number;
};

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  ownedByEmail: text("owned_by_email"),
  ownedByTelegramUsername: text("owned_by_tg_username").notNull(),
  monthlyPrice: integer("monthly_price").notNull(),
  activatedAt: text("activated_at").notNull(),
  participants: text("participants", { mode: "json" }).notNull(),
  telegramChatId: integer("telegram_chat_id"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const SubscriptionType = subscriptions.$inferInsert;
