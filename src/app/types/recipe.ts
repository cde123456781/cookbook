import { type steps, type categories, type ingredients, recipes_ingredients } from "~/server/db/schema";

export type Category = typeof categories.$inferSelect;
export type Ingredient = typeof ingredients.$inferSelect;
export type Step = typeof steps.$inferSelect;
export type RecipeIngredient = typeof recipes_ingredients.$inferSelect;