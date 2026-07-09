// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  timestamp,
  varchar,
  pgTable,
  text,
  boolean,
  check,
  numeric,
  unique,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `cookbook_${name}`);

export const recipes = createTable(
  "recipes",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    title: varchar({ length: 100 }).notNull(),
    createdAt: timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()).notNull(),
    duration: varchar({ length: 100 }).notNull(),
    description: varchar({ length: 1000 }),
    authorId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    isPublic: boolean().notNull().default(false)
  },
  (t) => [index("recipe_title_idx").on(t.title)],
);

export const categories = createTable("categories", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 100 }).notNull().unique(),
});



export const recipes_ingredients = createTable(
  "recipes_ingredients",
  {
    recipeId: integer()
      .references(() => recipes.id, { onDelete: "cascade" })
      .notNull(),
    ingredient: varchar({ length: 200 }).notNull(),
    amount: varchar({ length: 100 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.recipeId, table.ingredient] }),
  ],
);

export const recipes_categories = createTable(
  "recipes_categories",
  {
    recipeId: integer()
      .references(() => recipes.id, { onDelete: "cascade" })
      .notNull(),
    categoryId: integer()
      .references(() => categories.id)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.recipeId, table.categoryId] })],
);

export const steps = createTable(
  "steps",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    recipeId: integer()
      .references(() => recipes.id, { onDelete: "cascade" })
      .notNull(),
    stepNumber: integer().notNull(),
    stepDescription: varchar({ length: 1000 }).notNull(),
  },
  (table) => [unique("steps_recipe_id_step_number_unique").on(table.recipeId, table.stepNumber)],
);

export const images = createTable(
  "images",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),

    key: varchar().notNull(),
    url: varchar().notNull(),

    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    recipeId: integer().references(() => recipes.id, {
      onDelete: "cascade",
    }),

    stepId: integer().references(() => steps.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [
    unique("images_recipe_id_unique").on(table.recipeId),
    unique("images_step_id_unique").on(table.stepId),

    check(
      "images_owner_check",
      sql`
        (
          (${table.recipeId} IS NOT NULL AND ${table.stepId} IS NULL)
          OR
          (${table.recipeId} IS NULL AND ${table.stepId} IS NOT NULL)
        )
      `,
    ),
  ],
);


export const recipeNotes = createTable("recipeNotes", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  recipeId: integer()
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
  note: varchar({ length: 1000 }).notNull(),
});

export const bookmarks = createTable("bookmarks", {
    recipeId: integer()
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),

    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
}, 
(table) => [
  primaryKey({
    columns: [table.recipeId, table.userId]
  })
]);

export const user = createTable("user", {
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
  username: text("username").unique().notNull(),
  displayUsername: text("display_username"),
});

export const session = createTable(
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

export const account = createTable(
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

export const verification = createTable(
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

// ____________________________________Recipe Relations___________________________________//
export const recipeRelations = relations(recipes, ({ one, many }) => ({
  author: one(user, {
    fields: [recipes.authorId],
    references: [user.id],
  }),

  ingredients: many(recipes_ingredients),
  categories: many(recipes_categories),
  steps: many(steps),
  notes: many(recipeNotes),
  recipeImage: one(images)
}));

export const recipeIngredientRelations = relations(
  recipes_ingredients,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipes_ingredients.recipeId],
      references: [recipes.id],
    }),
  }),
);


export const recipeCategoryRelations = relations(
  recipes_categories,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipes_categories.recipeId],
      references: [recipes.id],
    }),

    category: one(categories, {
      fields: [recipes_categories.categoryId],
      references: [categories.id],
    }),
  }),
);

export const categoryRelations = relations(categories, ({ many }) => ({
  recipes: many(recipes_categories),
}));

export const stepRelations = relations(steps, ({ one }) => ({
  recipe: one(recipes, {
    fields: [steps.recipeId],
    references: [recipes.id],
  }),

  stepImage: one(images)
}));

export const recipeNoteRelations = relations(recipeNotes, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeNotes.recipeId],
    references: [recipes.id],
  }),
}));

export const userRecipeRelations = relations(user, ({ many }) => ({
  recipes: many(recipes),
  images: many(images)
}));



export const imageRelations = relations(images, ({ one }) => ({
  recipe: one(recipes, {
    fields: [images.recipeId],
    references: [recipes.id],
  }),

  step: one(steps, {
    fields: [images.stepId],
    references: [steps.id],
  }),

  user: one(user, {
    fields: [images.userId],
    references: [user.id],
  }),
}));


export const bookmarksRelations = relations(bookmarks, ({one}) => ({
  recipe: one(recipes, {
    fields: [bookmarks.recipeId],
    references: [recipes.id]
  }),

  user: one(user, {
    fields: [bookmarks.userId],
    references: [user.id]
  })
}))