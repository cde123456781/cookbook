import { headers } from "next/headers";
import Link from "next/link";
import RecipeDisplay from "~/components/recipeDisplay";
import { auth } from "~/lib/auth";
import { getRecipe } from "~/server/queries/recipe";

export default async function RecipePage({params}: {params: Promise<{recipe: string}>}) {
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
            recipe = await getRecipe("", Number(recipeId));
        } else {
            recipe = await getRecipe(session.user.id, Number(recipeId));
        }
    }


  return (
    <RecipeDisplay recipe={recipe}/>
  );
}
