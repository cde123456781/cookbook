import { type steps, type categories, recipes_ingredients,  } from "~/server/db/schema";

export type Category = typeof categories.$inferSelect;
export type Step = typeof steps.$inferSelect;
export type RecipeIngredient = typeof recipes_ingredients.$inferSelect;
