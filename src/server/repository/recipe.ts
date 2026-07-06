"use server";

import type { RecipePayload, UploadThingResponseData } from "~/app/types/recipe";
import { createRecipeSchema } from "../drizzleValidators/recipe";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { db } from "../db";
import { images, recipeNotes, recipes, recipes_categories, recipes_ingredients, steps } from "../db/schema";
import { utapi } from "~/server/uploadthing";
import { fileTypeFromBlob } from "file-type";
import { string } from "zod";

export const createRecipe = async (payload: RecipePayload) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user?.id;

    if (userId === undefined) {
        throw new Error("User not logged in");
    }

    const updatedPayload = {
        ...payload,
        authorId: userId
    };

    const result = createRecipeSchema.safeParse(
        updatedPayload
    );
    
    const recipeImageData: UploadThingResponseData = {key: undefined, url: undefined};
    const stepImages: File[] = [];
    const stepImagesData: UploadThingResponseData[] = [];

    if (!result.success) {
        const errors = result.error.issues.map(i => i.message).join(", ");
        console.dir(result.error.issues, { depth: null });
        throw new Error(errors)

    } else {
        if (payload.recipeImage) {
            const image = payload.recipeImage;
            const recipeImageValidation = await fileTypeFromBlob(image);
            if (!recipeImageValidation?.mime.startsWith("image/")) {
                
                throw new Error("Recipe Image is not a valid image file: " + recipeImageValidation?.mime);
            
            }
            
        }

        for (const step of payload.steps) {
            if (step.image) {
                const stepImageValidation = await fileTypeFromBlob(step.image);
                if (!stepImageValidation?.mime.startsWith("image/")) {
                    
                    throw new Error("Step Image is not a valid image file: " + stepImageValidation?.mime);
                
                } else {
                    stepImages.push(step.image);

                }
            }

        }
        
        if (payload.recipeImage) {
            const response = await utapi.uploadFiles(payload.recipeImage);
            recipeImageData.key = response.data?.key; 
            recipeImageData.url = response.data?.ufsUrl;


        }

        for (const image of stepImages) {
            const response = await utapi.uploadFiles(image);
            const data = response.data;
            if (data) {
                const stepImageData = {key: data.key, url: data.ufsUrl}
                stepImagesData.push(stepImageData);
            }
        }



        try {
            const result = await db.transaction(async (tx) => {
                const [recipe] = await tx
                .insert(recipes)
                .values({
                    title: payload.title,
                    duration: payload.duration,
                    authorId: userId,
                    
                })
                .returning({ id: recipes.id });

                const recipeId = recipe!.id;
                
                if (recipeImageData.key && recipeImageData.url) {
                    await tx.insert(images).values({
                        key: recipeImageData.key,
                        url: recipeImageData.url,
                        userId: userId,
                        recipeId: recipeId,
                        stepId: null

                    })
                };


                await tx.insert(recipes_ingredients).values(
                payload.ingredients.map((i) => ({
                    ...i,
                    recipeId: recipeId,
                }))
                );

                if (payload.categories.length > 0) {
                    await tx.insert(recipes_categories).values(
                    payload.categories.map((i) => ({
                        ...i,
                        recipeId: recipeId,
                    }))
                    );
                }
                
                if (payload.notes.length > 0) {
                    await tx.insert(recipeNotes).values(
                    payload.notes.map((i) => ({
                        ...i,
                        recipeId: recipeId,
                    }))
                    );
                }

                const insertedSteps = await tx.insert(steps).values(
                payload.steps.map((i) => ({
                    stepNumber: i.stepNumber,
                    stepDescription: i.stepDescription,
                    recipeId: recipeId,
                }))
                ).returning({id: steps.id});


                for (const [index, data] of stepImagesData.entries()) {
                    if (data.key && data.url) {
                        await tx.insert(images).values({
                            key: data.key,
                            url: data.url,
                            userId: userId,
                            recipeId: null,
                            stepId: insertedSteps[index]!.id
                            
                        });
                    }   
                }

                return recipeId;
            });

            return result;
        } catch (err) {
            console.log(err);
            if (recipeImageData.key) {
                await utapi.deleteFiles(recipeImageData.key);
            }

            for (const data of stepImagesData) {
                if (data.key) {
                    await utapi.deleteFiles(data.key);
                }
            }
            throw new Error("Failed to create recipe");
        }

    }
}
