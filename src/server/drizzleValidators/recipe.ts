import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { recipeNotes, recipes, recipes_categories, recipes_ingredients, steps } from "../db/schema";

export const insertRecipeSchema = createInsertSchema(recipes).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export const insertRecipeCategorySchema = createInsertSchema(recipes_categories);

export const insertRecipeIngredientSchema = createInsertSchema(recipes_ingredients);

export const insertStepsSchema = createInsertSchema(steps).omit({
    id: true
});

export const insertRecipeNotesSchema = createInsertSchema(recipeNotes).omit({
    id: true
});


export const createRecipeSchema = insertRecipeSchema.extend({
    ingredients: z.array(
        insertRecipeIngredientSchema.omit({recipeId: true})
    ).min(1, "At least one ingredient is needed")
    .max(20, "At most 20 ingredients can be added"),
    categories: z
    .array(
      insertRecipeCategorySchema.pick({
        categoryId: true,
      }),
    ),
    steps: z.array(
        insertStepsSchema.omit({recipeId: true})
    ).min(1, "At least one step is needed")
    .max(20, "At most 20 steps can be added"),
    notes: z.array(
        insertRecipeNotesSchema.omit({recipeId: true})
    ).max(10, "At most 10 notes can be added").optional()
});