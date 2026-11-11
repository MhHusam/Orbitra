import { sqliteTable, text, integer, index, primaryKey } from "drizzle-orm/sqlite-core";

export const leads = sqliteTable(
  "leads",
  {
    id: text("id").primaryKey(),
    idempotencyKey: text("idempotency_key").notNull().unique(),
    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    contactMethod: text("contact_method").notNull(),
    phone: text("phone"),
    companyName: text("company_name").notNull(),
    companySize: text("company_size").notNull(),
    country: text("country").notNull(),
    demoDate: text("demo_date").notNull(),
    data: text("data", { mode: "json" }).notNull(),
    webhookStatus: integer("webhook_status"),
    createdAt: text("created_at").notNull(),
  },
  (t) => [index("idx_leads_email_created").on(t.email, t.createdAt)],
);

export const rateLimits = sqliteTable(
  "rate_limits",
  {
    ip: text("ip").notNull(),
    windowStart: text("window_start").notNull(),
    count: integer("count").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.ip, t.windowStart] })],
);
