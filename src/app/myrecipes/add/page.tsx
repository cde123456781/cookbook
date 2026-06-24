import { categories, ingredients, units } from "~/server/db/schema";
import { db } from "~/server/db";
import NewRecipeForm from "~/components/recipeForm";

export default async function LoginPage() {
  const [categoriesData, ingredientsData, unitsData] = await Promise.all([
    db.select().from(categories),
    db.select().from(ingredients),
    db.select().from(units),
  ]);

  return (
    <NewRecipeForm
      categories={categoriesData}
      ingredients={ingredientsData}
      units={unitsData}
    />
  );
}
