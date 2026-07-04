import type { RecipePayload } from "~/app/types/recipe";
import { createRecipeSchema } from "../drizzleValidators/recipe";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { db } from "../db";
import { recipes, recipes_ingredients } from "../db/schema";

export const createRecipe = async (payload: RecipePayload) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user?.id;

    if (userId === undefined) {
        throw new Error("User not logged in");
    }

    const result = createRecipeSchema.safeParse(
        payload
    );

    if (!result.success) {
        const errors = result.error.issues.map(i => i.message).join(", ");
        throw new Error(errors)

    } else {

        try {
            const result = await db.transaction(async (tx) => {
                const [recipe] = await tx
                .insert(recipes)
                .values({
                    title: payload.title,
                    duration: payload.duration,
                    authorId: userId
                })
                .returning({ id: recipes.id });

                const recipeId = recipe!.id;

                await tx.insert(recipes_ingredients).values(
                payload.ingredients.map((i) => ({
                    ...i,
                    recipeId,
                }))
                );

                return recipeId;
            });

            return result;
        } catch (err) {
            throw new Error("Failed to create recipe");
        }

    }
}
