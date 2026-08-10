import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const mediaStateTable = pgTable("media_state", {
  userId: text("user_id").primaryKey(),
  favorites: jsonb("favorites").$type<string[]>().notNull().default([]),
  playlists: jsonb("playlists")
    .$type<Array<{ id: string; name: string; itemIds: string[] }>>()
    .notNull()
    .default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const historyTable = pgTable("media_history", {
  userId: text("user_id").notNull(),
  itemId: text("item_id").notNull(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  type: text("type").notNull(),
  uri: text("uri").notNull(),
  artwork: text("artwork"),
  playedAt: timestamp("played_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMediaStateSchema = createInsertSchema(mediaStateTable).omit({
  updatedAt: true,
});
export type InsertMediaState = z.infer<typeof insertMediaStateSchema>;
export type MediaState = typeof mediaStateTable.$inferSelect;
export type HistoryRow = typeof historyTable.$inferSelect;