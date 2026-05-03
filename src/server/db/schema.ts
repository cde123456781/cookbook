// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { index, integer, pgTableCreator, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";

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