import { bigint, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable('links', {
  id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  code: text().notNull().unique(),
  url: text().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  clicks: integer().notNull().default(0)
})
