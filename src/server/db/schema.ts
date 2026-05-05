// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { index, integer, pgTableCreator, primaryKey, timestamp, varchar, pgTable, text, boolean, } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `cookbook_${name}`);

export const recipes = createTable(
  "recipes",{
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    title: varchar({ length: 32 }).notNull(),
    createdAt: timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    description: varchar({ length: 256}),
    imageUrl: varchar({ length: 256 }),
    categoryId: integer().references(() => categories.id)
  },
  (t) => [index("name_idx").on(t.title)],
);


export const categories = createTable(
  "categories",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    name: varchar({ length: 32 }).notNull().unique()
  }
)

export const ingredients = createTable(
  "ingredients",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    name: varchar({ length: 32 }).notNull().unique()
  }
)

export const units = createTable(
  "units",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    name: varchar({ length: 32 }).unique(),
    plural: varchar({ length: 32 }).unique()
  }
)


export const recipes_ingredients = createTable(
  "recipes_ingredients",
  {
    recipeId: integer().references(() => recipes.id).notNull(),
    ingredientId: integer().references(() => ingredients.id).notNull(),
    unitId: integer().references(() => units.id).notNull()
  },
  (table) => [
    primaryKey({columns: [table.recipeId, table.ingredientId, table.unitId]})
  ]
)

export const steps = createTable(
  "steps",
  {
    recipeId: integer().references(() => recipes.id).notNull(),
    stepNumber: integer().notNull(),
    stepDescription: varchar({ length: 256 }).notNull()
  },
  (table) => [
    primaryKey({columns: [table.recipeId, table.stepNumber]})
  ]
)

export const recipeNotes = createTable(
  "recipeNotes",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    recipeId: integer().references(() => recipes.id).notNull(),
    note: varchar({ length: 256 }).notNull()
  }
)





export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
