import Link from "next/link";
import { RecipeListCard } from "~/components/recipeListCard";
import { auth } from "~/lib/auth";
import { authClient } from "~/lib/auth-client";
import { getRecipes } from "~/server/queries/recipe";
import { headers } from "next/headers";
import { getCategories } from "~/server/queries/category";
import { RecipeCollection } from "~/components/recipeCollection";


export default async function MyRecipesPage() {
    const session = await auth.api.getSession({
      headers: await headers() // you need to pass the headers object.
    })


    let recipes = [];

    if (!session) {
        recipes = await getRecipes("");
    } else {
        recipes = await getRecipes(session.user.id);
    }

    const categories = await getCategories();


    return (
        <RecipeCollection recipes={recipes} categories={categories}/>
    );
}


