"use client";

import Link from "next/link";
import type { Category } from "~/app/types/recipe";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "~/lib/auth-client";
import Select from "react-select";
import type { SingleValue, ActionMeta, InputActionMeta } from "react-select";

export default function NewRecipeForm({
  categories,
}: {
  categories: Category[];
}) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [recipeIngredients, setRecipeIngredients] = useState([
    {
      ingredient: "",
      amount: "",
    },
  ]);

  const [steps, setSteps] = useState([
    {
      stepNumber: 1,
      stepDescription: "",
      imageUrl: "",
    },
  ]);

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
    setNotes([...notes, ""]);
  };

  const removeNote = (index: number) => {
    const newNotes = [...notes];
    newNotes.splice(index, 1);

    setNotes(newNotes);
  };

  const updateNote = (index: number, newValue: string) => {
    const newNotes = [...notes];
    newNotes[index] = newValue;
    setNotes(newNotes);
  };

  const updateIngredient = (
    index: number,
    parameter: string,
    newValue: string,
  ) => {
    const newIngredients = [...recipeIngredients];
    if (parameter == "amount") {
      newIngredients[index]!.amount = newValue;
    } else if (parameter == "ingredient") {
      newIngredients[index]!.ingredient = newValue;
    }

    setRecipeIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...recipeIngredients];
    newIngredients.splice(index, 1);

    setRecipeIngredients(newIngredients);
  };

  const addIngredient = () => {
    const newIngredients = [...recipeIngredients];
    newIngredients.push({
      ingredient: "",
      amount: ""
    });

    setRecipeIngredients(newIngredients);
  };



  const addStep = () => {
    const newSteps = [...steps];
    const newNumber = newSteps.length + 1;
    newSteps.push({
      stepNumber: newNumber,
      stepDescription: "",
      imageUrl: "",
    });

    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);

    setSteps(newSteps);
  };

  const updateStep = (index: number, parameter: string, newValue: string) => {
    const newSteps = [...steps];
    if (parameter == "stepDescription") {
      newSteps[index]!.stepDescription = newValue;
    }

    setSteps(newSteps);
  };

  const submitRecipe = () => {
    return;
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

        <label className="label mt-4 text-base">Duration</label>
        <input
          type="text"
          className="input w-full"
          placeholder="45 minutes"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <label className="label mt-4 text-base">Description</label>
        <textarea
          className="textarea w-full"
          placeholder="A family favourite..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="label mt-4 text-base">Recipe Image URL</label>
        <input
          type="text"
          className="input w-full"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

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



            <input
              type="text"
              className="input flex-1"
              placeholder="Enter the name of the ingredient"
              value={ingredient.ingredient}
              onChange={(e) =>
                updateIngredient(index, "ingredient", e.target.value)
              }
            />

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
        >
          Add Ingredient
        </button>

        {/* Steps */}
        <div className="divider">Instructions</div>

        {steps.map((step, index) => (
          <div key={index} className="card bg-base-100 mb-4 border p-4">
            <div className="mb-2 font-semibold">Step {index + 1}</div>

            <textarea
              className="textarea w-full"
              placeholder="Describe this step..."
              value={step.stepDescription}
              onChange={(e) =>
                updateStep(index, "stepDescription", e.target.value)
              }
            />

            {/*
        <input
          className="input mt-2"
          placeholder="Optional image URL"
          value={step.imageUrl}
          onChange={(e) =>
            updateStep(index, "imageUrl", e.target.value)
          }
        />
        */}
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

        <button className="btn btn-primary" onClick={submitRecipe}>
          Create Recipe
        </button>
      </fieldset>
    </div>
  );
}
