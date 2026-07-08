"use client";

import type { FullRecipeDetails } from "~/app/types/recipe";

export default function RecipeDisplay(props: {
  recipe: FullRecipeDetails | undefined
}) {

    if (!props.recipe) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <p className="text-gray-500">
                    Recipe could not be found
                </p>
            </div>
        );

    }


  return (
<></>
  );
}