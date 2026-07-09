import { username } from "better-auth/plugins";
import { db } from "../db";
import { bookmarks, images, recipes } from "../db/schema";
import { and, eq, or } from "drizzle-orm";


export async function getRecipes(userId?: string) {
    return await db.query.recipes.findMany({
        with: {
            categories: {
                with: {
                    category: true,
                },
            },
            recipeImage: true
        },
        where: userId
      ? or(
          eq(recipes.isPublic, true),
          eq(recipes.authorId, userId)
        )
      : eq(recipes.isPublic, true),
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

export async function getRecipe(userId: string, recipeId: number) {
  return await db.query.recipes.findFirst({
        with: {
            categories: {
                with: {
                    category: true,
                },
            },
            steps: {
                with: {
                    stepImage: true
                }
            },
            ingredients: true,
            notes: true,

            recipeImage: true,
            author: true
        },
        where: and(or(
            eq(recipes.isPublic, true),
            eq(recipes.authorId, userId)
        ), eq(recipes.id, recipeId))
        });
}


export async function getRecipeWithoutUser(recipeId: number) {
  return await db.query.recipes.findFirst({
        with: {
            categories: {
                with: {
                    category: true,
                },
            },
            steps: {
                with: {
                    stepImage: true
                }
            },
            ingredients: true,
            notes: true,

            recipeImage: true,
            author: true
        },
        where: eq(recipes.id, recipeId)
        });
}




export async function getIsBookmarked(recipeId: number, userId: string) {
    const bookmark = await db.query.bookmarks.findFirst({
        where: and(
            eq(bookmarks.recipeId, recipeId),
            eq(bookmarks.userId, userId)
        )
    });

    if (bookmark) {
        return true;
    } else {
        return false;
    }
}

export async function getImages(recipeId: number) {
    const recipeImages = await db.query.images.findMany({
        where: eq(images.recipeId, recipeId)
    });

    return recipeImages;
}