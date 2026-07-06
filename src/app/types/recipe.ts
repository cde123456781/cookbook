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
  selectedCategories: {categoryId: number}[];
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
  notes: {note: string}[];
};


export type RecipePayload = {
  title: string,
  description: string,
  duration: string,
  ingredients: {
    ingredient: string;
    amount: string;
  }[],
  steps: {
    id: string;
    stepNumber: number;
    stepDescription: string;
    image: File | null;
    imagePreview: string | null;
  }[],
  notes: {
    note: string;
  }[],
  categories: {
    categoryId: number;
  }[],
  recipeImage: File | null
}


export type UploadThingResponseData = {
  key: string | undefined, url: string | undefined
}