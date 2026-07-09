"use client";

import { useState } from "react";
import type { FullRecipeDetails } from "~/app/types/recipe";
import { authClient } from "~/lib/auth-client";
import { BookmarkButton } from "./bookmarkButton";
import { deleteRecipe } from "~/server/repository/recipe";
import { router } from "better-auth/api";
import { useRouter } from "next/navigation";
import { PrivateButton } from "./privateButton";


export default function RecipeDisplay(props: {
  recipe: FullRecipeDetails | undefined,
  isBookmarked: boolean
}) {
    const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(false);
    const router = useRouter();


    const recipe = props.recipe;
    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch, //refetch the session
      } = authClient.useSession();


    if (!recipe) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <p className="text-gray-500">
                    Recipe could not be found
                </p>
            </div>
        );

    }
    let userId;


    const handleDelete = async() => {
      setIsDeleteButtonDisabled(true);
      try {
        await deleteRecipe(recipe.id)
        router.push("/myrecipes")
      } finally {

      }



      setIsDeleteButtonDisabled(false);
    };
    

    



  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Hero */}
      <section className="card bg-base-200 shadow-xl overflow-hidden">
        {recipe.recipeImage && (
          <figure>
            <img
              src={recipe.recipeImage.url}
              alt={recipe.title}
              width={1200}
              height={600}
              className="w-full h-96 object-cover"
            />
          </figure>
        )}

        <div className="card-body">
          <div className="flex justify-between gap-4 items-start">
            <div>
              <h1 className="card-title text-4xl">
                {recipe.title}
              </h1>
              <p className="text-lg text-base-content/60 mt-1">
                Submitted by: {recipe.author.username}
              </p>
            </div>

            {session?.user.id == recipe.authorId &&
              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  ⋮
                </button>

                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow"
                >
                  <li>
                    <PrivateButton isPublic={recipe.isPublic} recipeId={recipe.id} />
                  </li>
                  <li>
                    <button>Edit</button>
                  </li>
                  <li>
                    <button className="text-error" onClick={handleDelete} disabled={isDeleteButtonDisabled}>Delete</button>
                  </li>
                </ul>
              </div>
              }

              {session && session.user.id != recipe.authorId &&
                <BookmarkButton isBookmarked={props.isBookmarked} recipeId={recipe.id}/>
              }
          </div>
            

          <div className="flex flex-wrap gap-2 mt-2">
            {recipe.categories.map(({ category }) => (
              <span
                key={category.id}
                className="badge badge-primary"
              >
                {category.name}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="stat bg-base-100 rounded-box">
              <div className="stat-title">Duration</div>
              <div className="stat-value text-xl">
                {recipe.duration}
              </div>
            </div>

            <div className="stat bg-base-100 rounded-box">
              <div className="stat-title">Steps</div>
              <div className="stat-value text-xl">
                {recipe.steps.length}
              </div>
            </div>

            <div className="stat bg-base-100 rounded-box">
  <div className="flex flex-col gap-3">
    <div>
      <div className="stat-title">Created</div>
      <div className="text-lg font-semibold">
        {recipe.createdAt.toLocaleDateString()}
      </div>
    </div>

    <div className="divider my-0"></div>

    <div>
      <div className="stat-title">Updated</div>
      <div className="text-lg font-semibold">
        {recipe.updatedAt.toLocaleDateString()}
      </div>
    </div>
  </div>
</div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="card bg-base-200 p-6 shadow">
        <h2 className="text-2xl font-bold mb-3">
          Description
        </h2>

        <p className="opacity-80">
          {recipe.description ?? "No description provided."}
        </p>
      </section>

      {/* Steps */}
      <section>
        <h2 className="text-3xl font-bold mb-4">
          Instructions
        </h2>

        <div className="space-y-6">
          {recipe.steps
            .sort((a, b) => a.stepNumber - b.stepNumber)
            .map((step) => (
              <article
                key={step.id}
                className="card bg-base-200 shadow"
              >
                <div className="card-body">
                  <h3 className="card-title">
                    <span className="badge badge-primary">
                      {step.stepNumber}
                    </span>
                    Step {step.stepNumber}
                  </h3>

                  <p>{step.stepDescription}</p>

                  {step.stepImage && (
                    <img
                      src={step.stepImage.url}
                      alt={`Step ${step.stepNumber}`}
                      width={700}
                      height={400}
                      className="rounded-box mt-4 max-h-96 object-cover"
                    />
                  )}
                </div>
              </article>
            ))}
        </div>
      </section>

      {/* Notes */}
      {recipe.notes.length > 0 && (
        <section className="card bg-base-200 p-6 shadow">
          <h2 className="text-3xl font-bold mb-4">
            Notes
          </h2>

          <div className="space-y-3">
            {recipe.notes.map((note) => (
              <div
                key={note.id}
                className="alert"
              >
                {note.note}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Metadata */}
      <section className="text-sm opacity-60">

        {recipe.updatedAt && (
          <p>
            Updated:{" "}
            {recipe.updatedAt.toLocaleDateString()}
          </p>
        )}
      </section>
    </main>
  );
}