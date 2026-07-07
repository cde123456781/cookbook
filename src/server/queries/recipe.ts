import { db } from "../db";
import { images, recipes } from "../db/schema";
import { eq, or } from "drizzle-orm";


export async function getRecipes(userId: string) {
    return await db.query.recipes.findMany({
        with: {
            categories: {
                with: {
                    category: true,
                },
            },
            recipeImage: true
        },
        where: or(
            eq(recipes.isPublic, true),
            eq(recipes.authorId, userId)
        )
        });
}


export async function getMyRecipes(userId: string) {
  return await db.query.recipes.findMany({
        with: {
            categories: {
                with: {
                    category: true,
                },
            },
            recipeImage: true
        },
        where: (recipes, {eq}) => eq(recipes.authorId, userId)
        });
}
