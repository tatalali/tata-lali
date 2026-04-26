import { pgTable, uuid, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  locale: text("locale").notNull().default("fr"),
  source: text("source").notNull().default("cta_subscribe"), // cta_buy | cta_subscribe | outreach
  status: text("status").notNull().default("subscribed"), // subscribed | paid | unsubscribed
  stripeSessionId: text("stripe_session_id"),
  stripeCustomerId: text("stripe_customer_id"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const lessons_sent = pgTable("lessons_sent", {
  id: uuid("id").primaryKey().defaultRandom(),
  subscriberId: uuid("subscriber_id").notNull().references(() => subscribers.id, { onDelete: "cascade" }),
  lessonNumber: integer("lesson_number").notNull(),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
  openedAt: timestamp("opened_at"),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;
export type LessonSent = typeof lessons_sent.$inferSelect;
