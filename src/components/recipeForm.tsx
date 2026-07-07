"use client";

import Link from "next/link";
import type { Category, RecipeFormState } from "~/app/types/recipe";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { authClient } from "~/lib/auth-client";
import Select from "react-select";
import type { SingleValue, ActionMeta, InputActionMeta } from "react-select";
import { steps } from "~/server/db/schema";
import { ingredientsValidator, notesValidator, recipeDetailsValidator, stepsValidator } from "~/app/validators/recipeValidator";
import {produce} from "immer"
import { createRecipeSchema } from "~/server/drizzleValidators/recipe";
import { createRecipe } from "~/server/repository/recipe";

export default function NewRecipeForm({
  categories,
  initialState,
  mode
}: {
  categories: Category[];
  initialState: RecipeFormState
  mode: string
}) {
  const [title, setTitle] = useState(initialState.title);
  const [duration, setDuration] = useState(initialState.duration);
  const [description, setDescription] = useState(initialState.description);
  const [recipeImage, setRecipeImage] = useState<File | null>(initialState.recipeImage);
  const [recipeImagePreview, setRecipeImagePreview] = useState<string | null>(initialState.recipeImagePreview);

  const [selectedCategories, setSelectedCategories] = useState<{categoryId: number}[]>(initialState.selectedCategories);

  const [recipeIngredients, setRecipeIngredients] = useState(initialState.recipeIngredients);

  const [steps, setSteps] = useState(initialState.steps);

  const [notes, setNotes] = useState<{note: string}[]>(initialState.notes);

  const [isPublic, setIsPublic] = useState(initialState.isPublic);

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));


  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

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
      stepDescription: "",
      image: ""
    }
  ],
  stepsError: "",


  notes: [""],
  notesError: "",
  formError: ""
});

  const [errors, setErrors] = useState(createInitialErrors());


  // For clearing the recipe image input name when clearing image
  const recipeImageInput = useRef<HTMLInputElement | null>(null);
  
  const stepsImageInput = useRef<Record<string, HTMLInputElement | null>>({});


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

    setSelectedCategories(values.map((id) => ({categoryId: id})));
  };

  const addNote = () => {
    setNotes(produce(notes, draft => {
      draft.push({note: ""});
    }));


    setErrors(
      produce(errors, draft => {
        draft.notes.push("");
      })
    )
  };

  const removeNote = (index: number) => {
    setNotes(
      produce(notes, draft => {
        draft.splice(index, 1);
      })
    );

    setErrors(
      produce(errors, draft => {
        draft.notes.splice(index, 1);
      })
    )
  };

  const updateNote = (index: number, newValue: string) => {
    setNotes(
      produce(notes, draft => {
        draft[index]!.note = newValue;
      })
    );
  };

  const updateIsPublic = () => {
    setIsPublic(!isPublic);
  }

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
          stepDescription: "",
          image: ""
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

    setErrors(
      produce(errors, draft => {
        draft.steps.splice(index, 1);
      })
    )

  };

  const updateStep = (index: number, parameter: string, newValue: string) => {
    if (parameter == "stepDescription") {
      setSteps(produce(steps, draft => {
        draft[index]!.stepDescription = newValue;
      }))
    }


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
    setSubmitButtonDisabled(true);
    const recipeValidationResult = recipeDetailsValidator.safeParse({ title, duration, description });
    const ingredientsValidationResult = ingredientsValidator.safeParse(recipeIngredients);
    const stepsValidationResult = stepsValidator.safeParse(steps);
    const notesValidationResult = notesValidator.safeParse(notes);

    const newErrors = createInitialErrors();
    let hasNoErrors = true;
    

    if (!recipeValidationResult.success) {
      const fieldErrors = recipeValidationResult.error.flatten().fieldErrors;
      newErrors.title = fieldErrors.title?.[0] ?? "";
      newErrors.duration = fieldErrors.duration?.[0] ?? "";
      newErrors.recipeImage = "";
      hasNoErrors = false;
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
      hasNoErrors = false;


    }

    if (!stepsValidationResult.success) {
      const stepsErrors = steps.map(() => ({
        stepDescription: "",
        image: ""
      }));


      for (const issue of stepsValidationResult.error.issues) {
        if (issue.path.length === 0) {
          newErrors.stepsError = issue.message;
          continue;
        }

        const index = issue.path[0] as number;
        const field = issue.path[1] as "stepDescription";

        stepsErrors[index]![field] = issue.message;
      }

      newErrors.steps = stepsErrors;
      hasNoErrors = false;

    }


    if (!notesValidationResult.success) {
      const notesErrors = notes.map(() => (""));


      for (const issue of notesValidationResult.error.issues) {
        if (issue.path.length === 0) {
          newErrors.stepsError = issue.message;
          continue;
        }

        const index = issue.path[0] as number;

        notesErrors[index] = issue.message;
      }

      newErrors.notes = notesErrors;
      hasNoErrors = false;

    }


    if (recipeImage) {
      if (!recipeImage.type.startsWith("image/")) {
        newErrors.recipeImage = "Please upload image files only"
        hasNoErrors = false;
      }
    }

    for (let i = 0; i < steps.length; i ++ ) {
      const image = steps[i]!.image;
      if (image != null) {
        if (!image.type.startsWith("image/")) {
          newErrors.steps[i]!.image = "Please upload image files only";
          hasNoErrors = false;
        }
      }
    }


    

    if (hasNoErrors) {

      const payload = {
        title: title,
        description: description,
        duration: duration,
        ingredients: recipeIngredients,
        steps: steps,
        notes: notes,
        categories: selectedCategories,
        recipeImage: recipeImage,
        isPublic: isPublic
      };
      if (mode == "add") {
        try {
          await createRecipe(payload);
          router.push("/myrecipes");
        } catch (e) {
          if (typeof e === "string") {
              newErrors.formError = e.toUpperCase();
          } else if (e instanceof Error) {
              newErrors.formError = e.message;
          }
        }
      } else if (mode == "update") {
        
      }
      
    }
    setErrors(newErrors);
    setSubmitButtonDisabled(false);
  };

  return (
    <div className="m-5 flex justify-center">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box flex w-full max-w-4xl flex-col border p-10">
        <label className="fieldset-legend text-lg">{mode == "add" ? "Add Recipe" : "Update Recipe"}</label>

        {/* Recipe Details */}
        <label className="label mt-4 text-base">Recipe Title</label>
        <input
          type="text"
          className="input w-full"
          placeholder="Chocolate Chip Cookies"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p className="label text-error text-sm">
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
        <p className="label text-error text-sm">
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
              setErrors(produce(errors, draft => {
                draft.recipeImage = "Please upload image files only";
              }))
              e.target.value = "";
              return;
            }

            setRecipeImage(file);
            setRecipeImagePreview(URL.createObjectURL(file));
          }}
        />
        <p className="label text-error text-sm">
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

        <Select
          isMulti
          options={categoryOptions}
          value={categoryOptions.filter((option) =>
            selectedCategories.some((cat) => cat.categoryId === option.value)
          )}
          onChange={(selectedOptions) =>
            setSelectedCategories(
              selectedOptions
                ? selectedOptions.map((option) => ({
                    categoryId: option.value,
                  }))
                : []
            )
          }
          placeholder="Select categories..."
          closeMenuOnSelect={false}
          unstyled
          classNames={{
            control: ({ isFocused }) =>
              `input input-bordered w-full min-h-12 h-auto flex flex-wrap items-center px-2 ${
                isFocused ? "input-primary" : ""
              }`,
            valueContainer: () => "flex flex-wrap gap-1 py-1",
            placeholder: () => "text-base-content/50",
            input: () => "text-base-content",
            menu: () =>
              "mt-1 rounded-box border border-base-300 bg-base-100 shadow-lg z-50",
            option: ({ isFocused, isSelected }) =>
              `cursor-pointer px-3 py-2 ${
                isSelected
                  ? "bg-primary text-primary-content"
                  : isFocused
                  ? "bg-base-200"
                  : ""
              }`,
            multiValue: () => "badge badge-primary gap-1",
            multiValueLabel: () => "",
            multiValueRemove: () =>
              "cursor-pointer hover:text-error-content",
          }}
        />

        {/* Ingredients */}
        <div className="divider">Ingredients</div>

        {recipeIngredients.map((ingredient, index) => (
          <div key={index} className="mb-3 flex items-start gap-2">
            <div className="flex-1">
              <input
                type="text"
                className="input w-full"
                placeholder="Enter the amount of the ingredient"
                value={ingredient.amount}
                onChange={(e) =>
                  updateIngredient(index, "amount", e.target.value)
                }
              />

              <p className="label text-error text-sm min-h-5">
                {errors.ingredients[index]?.amount ?? "\u00A0"}
              </p>
            </div>

            <div className="flex-1">
              <input
                type="text"
                className="input w-full"
                placeholder="Enter the name of the ingredient"
                value={ingredient.ingredient}
                onChange={(e) =>
                  updateIngredient(index, "ingredient", e.target.value)
                }
              />

              <p className="label text-error text-sm min-h-5">
                {errors.ingredients[index]?.ingredient ?? "\u00A0"}
              </p>
            </div>

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

            <p className="label text-error text-sm">
              {errors.steps[index]!.stepDescription ? errors.steps[index]!.stepDescription : "\u00A0"}
            </p> 

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
                  setErrors(produce(errors, draft => {
                    draft.steps[index]!.image = "Please upload image files only"
                  }))
                  e.target.value = "";
                  return;
                }

                setSteps(produce(steps, draft => {
                  draft[index]!.image = file;
                  draft[index]!.imagePreview = URL.createObjectURL(file);
                }));
              }}
            />

            <p className="label text-error text-sm">
              {errors.steps[index]!.image ? errors.steps[index]!.image : "\u00A0"}
            </p>


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
          <div key={index} className="mb-2 flex items-start gap-2">
            <div className="flex-1">
              <input
                className="input w-full"
                value={note.note}
                placeholder="Optional recipe note"
                onChange={(e) => updateNote(index, e.target.value)}
              />

              <p className="label text-error text-sm min-h-5">
                {errors.notes[index] ?? "\u00A0"}
              </p>
            </div>

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

        <label className="label justify-center text-sm text-base-content pb-5">
          <input type="checkbox" checked={isPublic} onChange={updateIsPublic} className="checkbox" />
          Set public?
        </label>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={submitButtonDisabled}>
          {mode == "add" ? "Create Recipe" : "Update Recipe"}
        </button>

        <p className="label text-error text-sm">
              {errors.formError ? errors.formError : "\u00A0"}
            </p>
      </fieldset>
    </div>
  );
}
