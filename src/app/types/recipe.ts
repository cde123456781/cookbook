import { type steps, type categories, recipes_ingredients,  } from "~/server/db/schema";

export type Category = typeof categories.$inferSelect;
export type Step = typeof steps.$inferSelect;
export type RecipeIngredient = typeof recipes_ingredients.$inferSelect;

export type RecipeFormState = {
  title: string;
  duration: string;
  description: string;
  recipeImage: File | null;
  recipeImagePreview: string | null;
  selectedCategories: number[];
  recipeIngredients: {
    ingredient: string;
    amount: string;
  }[];
  steps: {
    id: string;
    stepNumber: number;
    stepDescription: string;
    image: File | null;
    imagePreview: string | null;
  }[];
  notes: string[];
};