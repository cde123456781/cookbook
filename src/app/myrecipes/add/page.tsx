import { categories } from "~/server/db/schema";
import { db } from "~/server/db";
import NewRecipeForm from "~/components/recipeForm";

export default async function LoginPage() {
  const [categoriesData] = await Promise.all([
    db.select().from(categories),
  ]);

  return (
    <NewRecipeForm
      categories={categoriesData}
    />
  );
}
