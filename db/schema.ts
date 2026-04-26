import { pgTable, uuid, text, timestamp, integer, unique } from "drizzle-orm/pg-core";

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

export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    number: integer("number").notNull(), // 1..30
    locale: text("locale").notNull().default("fr"),
    chapter: integer("chapter").notNull(), // 1=Comprendre, 2=Essayer, 3=Discerner, 4=Vivre avec
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    hook: text("hook"),
    bodyMd: text("body_md").notNull(),
    exercise: text("exercise"),
    teaser: text("teaser"),
    status: text("status").notNull().default("draft"), // draft | review | published
    generatedBy: text("generated_by").notNull().default("human"), // human | claude
    isPreview: integer("is_preview").notNull().default(0), // 1 = visible publiquement (démo)
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    uniqueNumberLocale: unique("lessons_number_locale_uq").on(t.number, t.locale),
  }),
);

export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;
export type LessonSent = typeof lessons_sent.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
