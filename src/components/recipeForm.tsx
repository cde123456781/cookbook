"use client";

import Link from "next/link";
import type { Category } from "~/app/types/recipe";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { authClient } from "~/lib/auth-client";
import Select from "react-select";
import type { SingleValue, ActionMeta, InputActionMeta } from "react-select";
import { steps } from "~/server/db/schema";
import { ingredientsValidator, recipeDetailsValidator } from "~/app/validators/recipeValidator";
import {produce} from "immer"

export default function NewRecipeForm({
  categories,
}: {
  categories: Category[];
}) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [recipeImage, setRecipeImage] = useState<File | null>(null);
  const [recipeImagePreview, setRecipeImagePreview] = useState<string | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [recipeIngredients, setRecipeIngredients] = useState([
    {
      ingredient: "",
      amount: "",
    },
  ]);

  const [steps, setSteps] = useState([
    {
      id: crypto.randomUUID(),
      stepNumber: 1,
      stepDescription: "",
      image: null as File | null,
      imagePreview: null as string | null
    },
  ]);

  const createInitialErrors = () => ({
  title: "",
  duration: "",
  recipeImage: "",
  ingredients: [
    {
      amount: "",
      ingredient: "",
    },
  ],
  ingredientsError: "",

  steps: [
    {
      description: ""
    }
  ],
  stepsError: ""
});

  const [errors, setErrors] = useState(createInitialErrors());


  // For clearing the recipe image input name when clearing image
  const recipeImageInput = useRef<HTMLInputElement | null>(null);
  
  const stepsImageInput = useRef<Record<string, HTMLInputElement | null>>({});

  const [notes, setNotes] = useState<string[]>([]);

  const router = useRouter();

  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className="text-gray-500">
          Please <Link href="/login">login</Link> to add a new recipe to your
          cookbook
        </p>
      </div>
    );
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value),
    );

    setSelectedCategories(values);
  };

  const addNote = () => {
    setNotes(produce(notes, draft => {
      draft.push("");
    }));
  };

  const removeNote = (index: number) => {
    setNotes(
      produce(notes, draft => {
        draft.splice(index, 1);
      })
    );
  };

  const updateNote = (index: number, newValue: string) => {
    setNotes(
      produce(notes, draft => {
        draft[index] = newValue;
      })
    );
  };

  const updateIngredient = (
    index: number,
    parameter: string,
    newValue: string,
  ) => {
    if (parameter == "amount") {
      setRecipeIngredients(
        produce(recipeIngredients, draft => {
          draft[index]!.amount = newValue;
        })
      );
    } else if (parameter == "ingredient") {
      setRecipeIngredients(
        produce(recipeIngredients, draft => {
          draft[index]!.ingredient = newValue;
        })
      );
    }

  };

  const removeIngredient = (index: number) => {
    setRecipeIngredients(
      produce(recipeIngredients, draft => {
        draft.splice(index, 1);
      })
    );

    setErrors(
      produce(errors, draft => {
        draft.ingredients.splice(index, 1);
      })
    )
  };

  const addIngredient = () => {
    setRecipeIngredients(
      produce(recipeIngredients, draft => {
        draft.push({ingredient: "", amount: ""})
      })
    );

    setErrors(
      produce(errors, draft => {
        draft.ingredients.push({ingredient: "", amount: ""})
      })
    )
  };



  const addStep = () => {
    const newNumber = steps.length + 1;

    setSteps(
      produce(steps, draft => {
        draft.push({
          id: crypto.randomUUID(),
          stepNumber: newNumber,
          stepDescription: "",
          image: null,
          imagePreview: null
        })
      })
    );

    setErrors(
      produce(errors, draft => {
        draft.steps.push({
          description: ""
        })
      })
    )
  };

  const removeStep = (index: number) => {
    setSteps(produce(steps, draft => {
      draft.splice(index, 1);
      for (let i = index; i < draft.length; i++ ) {
        draft[i]!.stepNumber = i + 1;
      }
    }));

  };

  const updateStep = (index: number, parameter: string, newValue: string) => {
    if (parameter == "stepDescription") {
      setSteps(produce(steps, draft => {
        draft[index]!.stepDescription = newValue;
      }))
    }


  };

  const submitRecipe = () => {
    return;
  };

  const clearRecipeImage = () => {
    setRecipeImage(null);
    setRecipeImagePreview(null);

    if (recipeImageInput.current) {
      recipeImageInput.current.value = "";
    }
  };


  const clearStepImage = (index: number) => {   

    setSteps(produce(steps, draft => {
      draft[index]!.image = null;
      draft[index]!.imagePreview = null;
    }))

    const input = stepsImageInput.current[steps[index]!.id];

    if (input) {
      input.value = "";
    }


  }

  const handleSubmit = async () => {
    const recipeValidationResult = recipeDetailsValidator.safeParse({ title, duration });
    const ingredientsValidationResult = ingredientsValidator.safeParse(recipeIngredients);

    const newErrors = createInitialErrors();

    if (!recipeValidationResult.success) {
      const fieldErrors = recipeValidationResult.error.flatten().fieldErrors;
      newErrors.title = fieldErrors.title?.[0] ?? "";
      newErrors.duration = fieldErrors.duration?.[0] ?? "";
      newErrors.recipeImage = "";
    }

    if (!ingredientsValidationResult.success) {
      const ingredientErrors = recipeIngredients.map(() => ({
        amount: "",
        ingredient: "",
      }));

      for (const issue of ingredientsValidationResult.error.issues) {
        if (issue.path.length === 0) {
          newErrors.ingredientsError = issue.message;
          continue;
        }

        const index = issue.path[0] as number;
        const field = issue.path[1] as "amount" | "ingredient";

        ingredientErrors[index]![field] = issue.message;
      }

      newErrors.ingredients = ingredientErrors;



    }


    setErrors(newErrors);
  };

  return (
    <div className="m-5 flex justify-center">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box flex w-full max-w-4xl flex-col border p-10">
        <label className="fieldset-legend text-lg">Add Recipe</label>

        {/* Recipe Details */}
        <label className="label mt-4 text-base">Recipe Title</label>
        <input
          type="text"
          className="input w-full"
          placeholder="Chocolate Chip Cookies"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p className="label text-error justify-center text-sm">
          {errors.title ? errors.title : "\u00A0"}
        </p>

        <label className="label mt-4 text-base">Duration</label>
        <input
          type="text"
          className="input w-full"
          placeholder="45 minutes"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <p className="label text-error justify-center text-sm">
          {errors.duration ? errors.duration : "\u00A0"}
        </p>

        <label className="label mt-4 text-base">Description</label>
        <textarea
          className="textarea w-full"
          placeholder="A family favourite..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="label mt-4 text-base">Recipe Image</label>
        <input
          type="file"
          ref={recipeImageInput}
          accept="image/*"
          className="file-input w-full"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (!file) {
              clearRecipeImage();
              return;
            }

            if (!file.type.startsWith("image/")) {
              alert("Please select an image.");
              e.target.value = "";
              return;
            }

            setRecipeImage(file);
            setRecipeImagePreview(URL.createObjectURL(file));
          }}
        />
        <p className="label text-error justify-center text-sm">
          {errors.recipeImage ? errors.recipeImage : "\u00A0"}
        </p>

        {recipeImagePreview && (
          <div className="mt-4 flex justify-center">
            <div className="relative w-full max-w-md">
              <img
                src={recipeImagePreview}
                alt="Recipe preview"
                className="w-full rounded-lg border object-cover"
              />

              <button
                type="button"
                onClick={() => {
                  clearRecipeImage();
                }}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="divider">Categories</div>

        <select
          multiple
          className="select select-bordered h-40 w-full"
          value={selectedCategories.map(String)}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Ingredients */}
        <div className="divider">Ingredients</div>

        {recipeIngredients.map((ingredient, index) => (
          <div key={index} className="mb-3 flex items-center gap-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="Enter the amount of the ingredient"
              value={ingredient.amount}
              onChange={(e) =>
                updateIngredient(index, "amount", e.target.value)
              }
            />
            <p className="label text-error justify-center text-sm">
              {errors.ingredients[index]!.amount ? errors.ingredients[index]!.amount : "\u00A0"}
            </p> 



            <input
              type="text"
              className="input flex-1"
              placeholder="Enter the name of the ingredient"
              value={ingredient.ingredient}
              onChange={(e) =>
                updateIngredient(index, "ingredient", e.target.value)
              }
            />

            <p className="label text-error justify-center text-sm">
              {errors.ingredients[index]!.ingredient ? errors.ingredients[index]!.ingredient : "\u00A0"}
            </p> 

            {recipeIngredients.length > 1 && (
              <button
                type="button"
                className="btn btn-error"
                onClick={() => removeIngredient(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline mt-2"
          onClick={addIngredient}
          disabled={recipeIngredients.length >= 20}
        >
          Add Ingredient
        </button>

        {/* Steps */}
        <div className="divider">Instructions</div>

        {steps.map((step, index) => (
          <div key={step.id} className="card bg-base-100 mb-4 border p-4">
            <div className="mb-2 font-semibold">Step {index + 1}</div>

            <textarea
              className="textarea w-full"
              placeholder="Describe this step..."
              value={step.stepDescription}
              onChange={(e) =>
                updateStep(index, "stepDescription", e.target.value)
              }
            />

            {/* <p className="label text-error justify-center text-sm">
              {errors.steps[index].description ? errors.steps[index].description : "\u00A0"}
            </p> */}

            <label className="label mt-4 text-base">Step Image</label>

            <input
              type="file"
              accept="image/*"
              ref={(element) => {
                stepsImageInput.current[step.id] = element;
              }}
              className="file-input w-full"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) {
                  clearStepImage(index);
                  return;
                }

                if (!file.type.startsWith("image/")) {
                  alert("Please select an image.");
                  e.target.value = "";
                  return;
                }

                setSteps(produce(steps, draft => {
                  draft[index]!.image = file;
                  draft[index]!.imagePreview = URL.createObjectURL(file);
                }));
              }}
            />

            {/* <p className="label text-error justify-center text-sm">
              {errors.steps[index].image ? errors.steps[index].image : "\u00A0"}
            </p> */}


            {steps[index]!.imagePreview && (
          <div className="mt-4 flex justify-center">
            <div className="relative w-full max-w-md">
              <img
                src={steps[index]!.imagePreview}
                alt={"Step " + index.toString() + "Image"}
                className="w-full rounded-lg border object-cover"
              />

              <button
                type="button"
                onClick={() => {
                  clearStepImage(index);
                }}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
              >
                ✕
              </button>
            </div>
          </div>
        )}


        {steps.length > 1 && (
            <button
              type="button"
              className="btn btn-error btn-sm mt-2 self-start"
              onClick={() => removeStep(index)}
            >
              Remove Step
            </button>
        )}
          </div>
        ))}

        <button type="button" className="btn btn-outline" onClick={addStep}>
          Add Step
        </button>

        {/* Notes */}
        <div className="divider">Notes</div>

        {notes.map((note, index) => (
          <div key={index} className="mb-2 flex gap-2">
            <input
              className="input flex-1"
              value={note}
              placeholder="Optional recipe note"
              onChange={(e) => updateNote(index, e.target.value)}
            />
            
            {/* <p className="label text-error justify-center text-sm">
              {errors.notes[index] ? errors.notes[index] : "\u00A0"}
            </p> */}

            <button
              type="button"
              className="btn btn-error"
              onClick={() => removeNote(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button type="button" className="btn btn-outline" onClick={addNote}>
          Add Note
        </button>

        <div className="divider"></div>

        <button className="btn btn-primary" onClick={handleSubmit}>
          Create Recipe
        </button>
      </fieldset>
    </div>
  );
}
