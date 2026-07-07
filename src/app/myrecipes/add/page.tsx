import { categories } from "~/server/db/schema";
import { db } from "~/server/db";
import NewRecipeForm from "~/components/recipeForm";

export default async function LoginPage() {
  const [categoriesData] = await Promise.all([
    db.select().from(categories),
  ]);

  const initialState = {
    title: "",
    duration: "",
    description: "",
    recipeImage: null,
    recipeImagePreview: null,
    selectedCategories: [],
    recipeIngredients: [{
      ingredient: "",
      amount: ""
    }],
    steps: [
      {
        id: crypto.randomUUID(),
        stepNumber: 1,
        stepDescription: "",
        image: null as File | null,
        imagePreview: null as string | null
      },
    ],
    notes: [],
    isPublic: false

  }

  return (
    <NewRecipeForm
      categories={categoriesData}
      initialState={initialState}
      mode="add"
    />
  );
}
