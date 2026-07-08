import { type steps, type categories, recipes_ingredients,  } from "~/server/db/schema";

export type Category = typeof categories.$inferSelect;
export type Step = typeof steps.$inferSelect;
export type RecipeIngredient = typeof recipes_ingredients.$inferSelect;

export type RecipeFormState = {
  title: string,
  duration: string,
  description: string,
  recipeImage: File | null,
  recipeImagePreview: string | null,
  selectedCategories: {categoryId: number}[],
  recipeIngredients: {
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
  notes: {note: string}[],
  isPublic: boolean,
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
  recipeImage: File | null,
  isPublic: boolean
}


export type UploadThingResponseData = {
  key: string | undefined, url: string | undefined
}


export type RecipeQueryResult = {
    duration: string;
    id: number;
    title: string;
    createdAt: Date;
    updatedAt: Date | null;
    description: string | null;
    authorId: string;
    categories: {
        recipeId: number;
        categoryId: number;
        category: {
            id: number;
            name: string;
        };
    }[];
    recipeImage: {
        url: string;
        id: number;
        recipeId: number | null;
        key: string;
        userId: string;
        stepId: number | null;
    } | null;
}


export type FullRecipeDetails = {
    id: number;
    title: string;
    duration: string;
    createdAt: Date;
    updatedAt: Date | null;
    description: string | null;
    authorId: string;
    isPublic: boolean;
    categories: {
        recipeId: number;
        categoryId: number;
        category: {
            id: number;
            name: string;
        };
    }[];
    steps: {
        id: number;
        recipeId: number;
        stepNumber: number;
        stepDescription: string;
    }[];
    notes: {
        id: number;
        note: string;
        recipeId: number;
    }[];
    recipeImage: {
        id: number;
        url: string;
        key: string;
        recipeId: number | null;
        userId: string;
        stepId: number | null;
    } | null;
}