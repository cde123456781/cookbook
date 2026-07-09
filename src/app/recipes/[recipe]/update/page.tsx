import { categories } from "~/server/db/schema";
import { db } from "~/server/db";
import NewRecipeForm from "~/components/recipeForm";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { getRecipe, getRecipeWithoutUser } from "~/server/queries/recipe";
import Link from "next/link";
import type { RecipeFormState } from "~/app/types/recipe";



export default async function UpdatePage({params}: {params: Promise<{recipe: string}>}) {
  const [categoriesData] = await Promise.all([
    db.select().from(categories),
  ]);

  const session = await auth.api.getSession({
          headers: await headers() // you need to pass the headers object.
      });
  
      const recipeId = (await params).recipe;
      let recipe;
      if (isNaN(Number(recipeId))) {
          return (
              <div className="flex h-[80vh] items-center justify-center">
                  <p className="text-gray-500">
                      Invalid path parameter
                  </p>
              </div>
          );
  
      } else {
          if (!session) {
            return (
              <div className="flex h-[80vh] items-center justify-center">
                    <p className="text-gray-500">
                    Please <Link href="/login">login</Link> to update recipes
                    </p>
                </div>
            );
          } else {
              recipe = await getRecipeWithoutUser(Number(recipeId));
          }
      }

      if (!recipe) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <p className="text-gray-500">
                    Recipe not found
                </p>
            </div>
        );
      } else if (recipe.authorId != session.user.id) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <p className="text-gray-500">
                    You do not have permission to update this recipe
                </p>
            </div>
        );
        
      } else {
        let recipeImage = null;
        let recipeImagePreview = null;
        if (recipe.recipeImage) {
            recipeImagePreview = recipe.recipeImage.url;
            recipeImage = null;

        } 

        const steps = [];

        for (const step of recipe.steps) {
            const stepImagePreview = (step.stepImage ? step.stepImage.url : null);
            const stepImage = null;
            const stepNumber = step.stepNumber;
            const stepDescription = step.stepDescription;
            const id = crypto.randomUUID();
            steps.push({
                id: id,
                stepDescription: stepDescription,
                image: stepImage,
                imagePreview: stepImagePreview,
                stepNumber: stepNumber
            });
        }

        const ingredients = recipe.ingredients;

        const initialState: RecipeFormState  = {
            title: recipe.title,
            duration: recipe.duration,
            description: recipe.description ?? "",
            recipeImage: recipeImage,
            recipeImagePreview: recipeImagePreview,
            selectedCategories: recipe.categories,
            recipeIngredients: ingredients,
            steps: steps,
            notes: recipe.notes,
            isPublic: recipe.isPublic

        }


        return (
            <NewRecipeForm
            categories={categoriesData}
            initialState={initialState}
            mode="update"
            recipeId={Number(recipeId)}
            />
        );


      }

  

  
}
