import { z } from "zod";


export const recipeDetailsValidator = z.object({
  title: z.string().max(100, "Title cannot be longer than 100 characters").nonempty("Title cannot be empty"),
  duration: z.string().max(100, "Duration cannot be longer than 100 characters").nonempty("Duration cannot be empty"),
  description: z.string().max(1000, "Description cannot be longer than 1000 characters"),
});

const ingredientsSchema = z.object({
  amount: z.string().max(100, "Amount cannot be greater than 100 characters").nonempty("Amount cannot be empty"),
  ingredient: z.string().max(200, "Ingredient cannot be longer than 200 characters").nonempty("Ingredient cannot be empty")

});

export const ingredientsValidator = z.array(ingredientsSchema)
.min(1, "There must be at least one ingredient")
.max(20, "There cannot be more than 20 ingredients");

const stepsSchema = z.object({
  stepDescription: z.string()
  .max(1000, "Description cannot be greater than 1000 characters")
  .nonempty("Description cannot be empty"),
});

export const stepsValidator = z.array(stepsSchema)
  .min(1, "There must be at least one step")
  .max(20, "There cannot be more than 20 steps");

export const notesValidator = z.array(
  z.string().min(1, "Note cannot be empty").max(1000, "Note cannot exceed 1000 characters")
).max(10, "There cannot be more than 10 notes");
