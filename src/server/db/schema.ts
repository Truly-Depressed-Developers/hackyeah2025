import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
import type { UserRole } from "./types";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `hackyeah2025_${name}`);

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
  role: d
    .varchar({ length: 50 })
    .$type<UserRole>()
    .notNull()
    .default("wolontariusz"),
  profileCompleted: d.boolean().notNull().default(false),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  events: many(events),
  volunteer: one(volunteers, {
    fields: [users.id],
    references: [volunteers.userId],
  }),
  company: one(companies, {
    fields: [users.id],
    references: [companies.userId],
  }),
  coordinator: one(coordinators, {
    fields: [users.id],
    references: [coordinators.userId],
  }),
}));

export const volunteers = createTable("volunteer", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id),
  firstName: d.varchar({ length: 255 }),
  lastName: d.varchar({ length: 255 }),
  isOfAge: d.boolean("is_of_age"),
}));

export const volunteersRelations = relations(volunteers, ({ one, many }) => ({
  user: one(users, {
    fields: [volunteers.userId],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const companies = createTable("company", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id),
  companyName: d.varchar({ length: 255 }),
  location: d.varchar({ length: 255 }),
  description: d.text(),
}));

export const companiesRelations = relations(companies, ({ one }) => ({
  user: one(users, {
    fields: [companies.userId],
    references: [users.id],
  }),
}));

export const coordinators = createTable("coordinator", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id),
  firstName: d.varchar({ length: 255 }),
  lastName: d.varchar({ length: 255 }),
  school: d.varchar({ length: 255 }),
}));

export const coordinatorsRelations = relations(coordinators, ({ one }) => ({
  user: one(users, {
    fields: [coordinators.userId],
    references: [users.id],
  }),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export const events = createTable("event", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 255 }).notNull(),
  description: d.text().notNull(),
  organizerName: d.varchar({ length: 255 }).notNull(),
  tags: d.jsonb().$type<string[]>().default([]),
  thumbnail: d.varchar({ length: 500 }),
  latitude: d.real(),
  longitude: d.real(),
  startDate: d.timestamp({ mode: "date", withTimezone: true }),
  endDate: d.timestamp({ mode: "date", withTimezone: true }),
  workload: d
    .jsonb()
    .$type<("Mini" | "Lekkie" | "Umiarkowane" | "Pełne")[]>()
    .default([]),
  form: d
    .jsonb()
    .$type<
      (
        | "Zostań aktywistą online"
        | "Dbaj o potrzeby dzielnicy"
        | "Weź udział w akcjach bezpośrednich"
        | "Spotkaj się z mieszkańcami"
        | "Zaangażuj się w obywatelską kontrolę"
        | "Wesprzyj pogotowie obywatelskie"
      )[]
    >()
    .default([]),
  externalId: d.varchar({ length: 255 }).unique(),
  syncStatus: d
    .varchar({ length: 50 })
    .$type<"pending" | "synced" | "error">()
    .notNull()
    .default("pending"),
  lastSyncedAt: d.timestamp({ mode: "date", withTimezone: true }),
  createdById: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdate(() => new Date()),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [events.createdById],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const applications = createTable("application", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  volunteerId: d
    .integer()
    .notNull()
    .references(() => volunteers.id),
  externalEventId: d.varchar({ length: 255 }).notNull(),
  eventTitle: d.varchar({ length: 255 }),
  companyName: d.varchar({ length: 255 }),
  message: d.text(),
  status: d
    .varchar({ length: 50 })
    .$type<"pending" | "accepted" | "rejected">()
    .notNull()
    .default("pending"),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  volunteer: one(volunteers, {
    fields: [applications.volunteerId],
    references: [volunteers.id],
  }),
}));
