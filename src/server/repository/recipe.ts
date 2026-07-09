"use server";

import type { RecipePayload, UploadThingResponseData } from "~/app/types/recipe";
import { createRecipeSchema } from "../drizzleValidators/recipe";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { db } from "../db";
import { bookmarks, images, recipeNotes, recipes, recipes_categories, recipes_ingredients, steps } from "../db/schema";
import { utapi } from "~/server/uploadthing";
import { fileTypeFromBlob } from "file-type";
import { string } from "zod";
import { and, eq } from "drizzle-orm";
import { getImages } from "../queries/recipe";

export const createRecipe = async (payload: RecipePayload) => {

    const userId = await validateUser();
    const stepImages = await validatePayload(payload, userId);
        
    const [recipeImageData, stepImagesData] = await uploadImages(payload.recipeImage, stepImages);



    try {
        const result = await db.transaction(async (tx) => {
            const [recipe] = await tx
            .insert(recipes)
            .values({
                title: payload.title,
                duration: payload.duration,
                authorId: userId,
                isPublic: payload.isPublic
                
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


export const updateRecipe = async(payload: RecipePayload, recipeId: number) => {
    const userId = await validateUser();
    const stepImages = await validatePayload(payload, userId);
        
    const [recipeImageData, stepImagesData] = await uploadImages(payload.recipeImage, stepImages);

    const oldImages = await getImages(recipeId);

    try {
        const result = await db.transaction(async (tx) => {
            await tx
                .update(recipes)
                .set({
                    title: payload.title,
                    duration: payload.duration,
                    authorId: userId,
                    isPublic: payload.isPublic
                    
                }).where(eq(recipes.id, recipeId));

            await tx.delete(images).where(
                eq(images.recipeId, recipeId)
            );

            
            if (recipeImageData.key && recipeImageData.url) {
                await tx.insert(images).values({
                    key: recipeImageData.key,
                    url: recipeImageData.url,
                    userId: userId,
                    recipeId: recipeId,
                    stepId: null

                })
            };

            await tx.delete(recipes_ingredients).where(
                eq(recipes_ingredients.recipeId, recipeId)
            );


            await tx.insert(recipes_ingredients).values(
            payload.ingredients.map((i) => ({
                ...i,
                recipeId: recipeId,
            }))
            );

            await tx.delete(recipes_categories).where(
                eq(recipes_categories.recipeId, recipeId)
            );

            if (payload.categories.length > 0) {
                await tx.insert(recipes_categories).values(
                payload.categories.map((i) => ({
                    ...i,
                    recipeId: recipeId,
                }))
                );
            }

            await tx.delete(recipeNotes).where(
                eq(recipeNotes.recipeId, recipeId)
            );
            
            if (payload.notes.length > 0) {
                await tx.insert(recipeNotes).values(
                payload.notes.map((i) => ({
                    ...i,
                    recipeId: recipeId,
                }))
                );
            }

            await tx.delete(steps).where(
                eq(steps.recipeId, recipeId)
            );

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
        });

        for (const data of oldImages) {
            if (data.key) {
                await utapi.deleteFiles(data.key);
            }
        }
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

const validateUser = async() => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user?.id;

    if (userId === undefined) {
        throw new Error("User not logged in");
    }
    return userId;
}

const validatePayload = async (payload: RecipePayload, userId: string) => {


    const updatedPayload = {
        ...payload,
        authorId: userId
    };

    const result = createRecipeSchema.safeParse(
        updatedPayload
    );

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

        const stepImages: File[] = [];
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

        return stepImages;
    }
}

const uploadImages = async(recipeImage: File | null, stepImages: File[]): Promise<[UploadThingResponseData, UploadThingResponseData[]]> => {
    const recipeImageData: UploadThingResponseData = {key: undefined, url: undefined};
    const stepImagesData: UploadThingResponseData[] = [];

    if (recipeImage) {
        const response = await utapi.uploadFiles(recipeImage);
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

    return [recipeImageData, stepImagesData];
}


export const addBookmark = async (recipeId: number) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user?.id;

    if (userId === undefined) {
        throw new Error("User not logged in");
    }

    const bookmark = await db.query.bookmarks.findFirst({
        where: and(
            eq(bookmarks.userId, userId),
            eq(bookmarks.recipeId, recipeId)
        ),
    });

    if (bookmark) {
        await db.delete(bookmarks).where(
            and(
            eq(bookmarks.userId, userId),
            eq(bookmarks.recipeId, recipeId)
        ));
    } else {
        await db.insert(bookmarks).values({
            userId: userId,
            recipeId: recipeId
        });
    }

}

export const deleteRecipe = async (recipeId: number) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user?.id;

    if (userId === undefined) {
        throw new Error("User not logged in");
    }

    await db.delete(recipes).where(
        and(
        eq(recipes.authorId, userId),
        eq(recipes.id, recipeId)
    ));
}

export const setRecipePrivacy = async (recipeId:number, isPublic: boolean) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user?.id;

    if (userId === undefined) {
        throw new Error("User not logged in");
    }

    await db.update(recipes).set(
        {isPublic: isPublic}
    ).where(
        and(
        eq(recipes.authorId, userId),
        eq(recipes.id, recipeId)
    ));
}